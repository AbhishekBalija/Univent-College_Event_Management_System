import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../../services';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

const CollegeLeaderboard = () => {
  const [collegeData, setCollegeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollegeLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await leaderboardService.getCollegeLeaderboard();
        console.log('College leaderboard data:', data);
        
        // Log each college entry to help with debugging
        if (data && data.length > 0) {
          console.log('College entries:');
          data.forEach((college, index) => {
            console.log(`${index + 1}. ${college.college} - ${college.participantCount} participants, ${college.totalScore} points`);
          });
        }
        
        setCollegeData(data);
      } catch (err) {
        console.error('Error fetching college leaderboard:', err);
        setError(err.message || 'Failed to load college leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeLeaderboard();
  }, []);

  // Function to get color based on rank
  const getRankColor = (index) => {
    switch (index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return '#1976d2'; // Default blue
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
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

  if (!collegeData || collegeData.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No college leaderboard data available yet.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h2">
          College Leaderboard
        </Typography>
      </Box>
      
      <TableContainer>
        <Table aria-label="college leaderboard table">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>College</TableCell>
              <TableCell align="right">Total Score</TableCell>
              <TableCell align="right">Participants</TableCell>
              <TableCell align="right">Events</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collegeData.map((college, index) => (
              <TableRow 
                key={college.college}
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  '&:hover': { backgroundColor: 'action.selected' },
                  ...(index < 3 && { backgroundColor: `${getRankColor(index)}10` })
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      sx={{ 
                        width: 30, 
                        height: 30, 
                        bgcolor: getRankColor(index),
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        mr: 1
                      }}
                    >
                      {index + 1}
                    </Avatar>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={index < 3 ? 'bold' : 'normal'}>
                    {college.college}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography 
                    fontWeight="bold" 
                    color={index < 3 ? getRankColor(index) : 'inherit'}
                  >
                    {college.totalScore}
                  </Typography>
                </TableCell>
                <TableCell align="right">{college.participantCount}</TableCell>
                <TableCell align="right">{college.eventCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CollegeLeaderboard;