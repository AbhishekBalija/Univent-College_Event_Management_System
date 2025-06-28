import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { leaderboardService } from '../../services';
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Grid
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import ScoreboardIcon from '@mui/icons-material/Scoreboard';

const ParticipantScore = ({ eventId }) => {
  const { user } = useSelector((state) => state.auth);
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipantScore = async () => {
      if (!user || !eventId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await leaderboardService.getParticipantScore(eventId, user._id);
        setScoreData(data);
      } catch (err) {
        console.error('Error fetching participant score:', err);
        setError(err.message || 'Failed to load your score');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantScore();
  }, [eventId, user]);

  // Function to get medal color based on rank
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#1976d2'; // Default blue
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!scoreData) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        You don't have a score for this event yet.
      </Alert>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: `1px solid ${getMedalColor(scoreData.rank)}40`,
        boxShadow: `0 4px 12px ${getMedalColor(scoreData.rank)}20`
      }}
    >
      <Typography variant="h6" gutterBottom>
        Your Performance
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: `${getMedalColor(scoreData.rank)}20`,
                mb: 1
              }}
            >
              <ScoreboardIcon sx={{ fontSize: 40, color: getMedalColor(scoreData.rank) }} />
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {scoreData.score}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Score
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: `${getMedalColor(scoreData.rank)}20`,
                mb: 1
              }}
            >
              <MilitaryTechIcon sx={{ fontSize: 40, color: getMedalColor(scoreData.rank) }} />
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {scoreData.rank}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Rank
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: `${getMedalColor(scoreData.rank)}20`,
                mb: 1
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 40, color: getMedalColor(scoreData.rank) }} />
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {scoreData.achievements?.length || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Achievements
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      {scoreData.achievements && scoreData.achievements.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Your Achievements
          </Typography>
          
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {scoreData.achievements.map((achievement, index) => (
              <Chip 
                key={index} 
                label={achievement} 
                color="secondary" 
                variant="outlined"
              />
            ))}
          </Box>
        </>
      )}
      
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
        Last updated: {new Date(scoreData.lastUpdated).toLocaleString()}
      </Typography>
    </Paper>
  );
};

export default ParticipantScore;