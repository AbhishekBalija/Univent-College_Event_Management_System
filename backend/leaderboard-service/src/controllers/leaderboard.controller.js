const Leaderboard = require('../models/Leaderboard');

/**
 * @desc    Get leaderboard for a specific event
 * @route   GET /api/leaderboard/event/:eventId
 * @access  Public
 */
exports.getEventLeaderboard = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    // Get leaderboard entries for the event, sorted by score in descending order
    const leaderboard = await Leaderboard.find({ eventId })
      .sort({ score: -1 })
      .limit(100); // Limit to top 100 participants
    
    // Calculate ranks (in case they're not updated)
    const rankedLeaderboard = leaderboard.map((entry, index) => {
      return {
        ...entry.toObject(),
        rank: index + 1
      };
    });
    
    res.status(200).json({
      success: true,
      count: rankedLeaderboard.length,
      data: rankedLeaderboard
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get participant's score for a specific event
 * @route   GET /api/leaderboard/event/:eventId/user/:userId
 * @access  Private
 */
exports.getParticipantScore = async (req, res, next) => {
  try {
    const { eventId, userId } = req.params;
    
    // Find the participant's score
    const scoreEntry = await Leaderboard.findOne({ eventId, userId });
    
    if (!scoreEntry) {
      return res.status(404).json({
        success: false,
        message: 'No score found for this participant in this event'
      });
    }
    
    // Get participant's rank
    const higherScores = await Leaderboard.countDocuments({
      eventId,
      score: { $gt: scoreEntry.score }
    });
    
    const rank = higherScores + 1;
    
    res.status(200).json({
      success: true,
      data: {
        ...scoreEntry.toObject(),
        rank
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update participant's score
 * @route   PUT /api/leaderboard/event/:eventId/user/:userId
 * @access  Private (Organizers and Admins only)
 */
exports.updateParticipantScore = async (req, res, next) => {
  try {
    const { eventId, userId } = req.params;
    const { points, achievements } = req.body;
    
    // Check if the score entry exists
    let scoreEntry = await Leaderboard.findOne({ eventId, userId });
    
    if (!scoreEntry) {
      // If no score entry exists, create a new one
      // We need to get the user's name from the request body since we don't have a direct connection to the user service
      if (!req.body.userName) {
        return res.status(400).json({
          success: false,
          message: 'userName is required when creating a new score entry'
        });
      }
      
      // Use the college from the request body, but ensure it's consistent for the same userId
      // First check if this user has any other entries in the leaderboard
      const existingUserEntry = await Leaderboard.findOne({ userId });
      // If we have an existing entry for this user, use that college name to ensure consistency
      // Otherwise, use the exact college name from the request body without normalization
      let college = '';
      if (existingUserEntry && existingUserEntry.college) {
        college = existingUserEntry.college;
      } else if (req.body.college) {
        // Use the exact college name as provided without normalization
        college = req.body.college;
      }
      
      scoreEntry = await Leaderboard.create({
        eventId,
        userId,
        userName: req.body.userName,
        score: points || 0,
        achievements: achievements || [],
        college: college
      });
    } else {
        // Update existing score entry
      if (points) {
        scoreEntry.score += points;
      }
      
      if (achievements && achievements.length > 0) {
        // Add new achievements that don't already exist
        achievements.forEach(achievement => {
          if (!scoreEntry.achievements.includes(achievement)) {
            scoreEntry.achievements.push(achievement);
          }
        });
      }
      
      scoreEntry.lastUpdated = Date.now();
      await scoreEntry.save();
    }
    
    // Get updated rank
    const higherScores = await Leaderboard.countDocuments({
      eventId,
      score: { $gt: scoreEntry.score }
    });
    
    const rank = higherScores + 1;
    
    // Update the rank in the database
    scoreEntry.rank = rank;
    await scoreEntry.save();
    
    res.status(200).json({
      success: true,
      message: 'Score updated successfully',
      data: {
        ...scoreEntry.toObject(),
        rank
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get top performers across all events
 * @route   GET /api/leaderboard/top
 * @access  Public
 */
exports.getTopPerformers = async (req, res, next) => {
  try {
    // Aggregate to get top performers across all events
    const topPerformers = await Leaderboard.aggregate([
      // Group by userId and sum scores
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          userName: { $first: '$userName' },
          college: { $first: '$college' },
          eventCount: { $sum: 1 },
          achievements: { $push: '$achievements' }
        }
      },
      // Sort by total score descending
      { $sort: { totalScore: -1 } },
      // Limit to top 20
      { $limit: 20 },
      // Project fields for output
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: 1,
          college: 1,
          totalScore: 1,
          eventCount: 1,
          // Flatten and deduplicate achievements
          achievements: {
            $reduce: {
              input: { $setUnion: [{ $reduce: { input: '$achievements', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } }] },
              initialValue: [],
              in: { $concatArrays: ['$$value', ['$$this']] }
            }
          }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      count: topPerformers.length,
      data: topPerformers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get college leaderboard
 * @route   GET /api/leaderboard/colleges
 * @access  Public
 */
exports.getCollegeLeaderboard = async (req, res, next) => {
  try {
    // Aggregate to get college leaderboard
    const collegeLeaderboard = await Leaderboard.aggregate([
      // Filter out entries without college or with empty college
      { $match: { college: { $exists: true, $ne: '', $ne: null } } },
      // Group by exact college name (no normalization) and sum scores
      {
        $group: {
          _id: '$college', // Group by the exact college name without normalization
          totalScore: { $sum: '$score' },
          participantCount: { $addToSet: '$userId' },
          eventCount: { $addToSet: '$eventId' }
        }
      },
      // Calculate participant and event counts
      {
        $project: {
          _id: 0,
          college: '$_id', // Use the exact college name for display
          totalScore: 1,
          participantCount: { $size: '$participantCount' },
          eventCount: { $size: '$eventCount' }
        }
      },
      // Sort by total score descending
      { $sort: { totalScore: -1 } },
      // Limit to top 20
      { $limit: 20 }
    ]);
    
    res.status(200).json({
      success: true,
      count: collegeLeaderboard.length,
      data: collegeLeaderboard
    });
  } catch (error) {
    next(error);
  }
};