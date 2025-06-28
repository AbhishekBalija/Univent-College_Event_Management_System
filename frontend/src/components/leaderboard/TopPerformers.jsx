import React, { useState, useEffect } from 'react';
import { leaderboardService } from '../../services';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const TopPerformers = () => {
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await leaderboardService.getTopPerformers();
        setTopPerformers(data);
      } catch (err) {
        console.error('Error fetching top performers:', err);
        setError(err.message || 'Failed to load top performers');
      } finally {
        setLoading(false);
      }
    };

    fetchTopPerformers();
  }, []);

  // Function to get avatar background color based on rank
  const getAvatarColor = (index) => {
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

  if (!topPerformers || topPerformers.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No top performers data available yet.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <EmojiEventsIcon sx={{ mr: 1, color: '#FFD700' }} />
        <Typography variant="h5" component="h2">
          Top Performers
        </Typography>
      </Box>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Participants with the highest cumulative scores across all events
      </Typography>
      
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {topPerformers.map((performer, index) => (
          <React.Fragment key={performer._id}>
            {index > 0 && <Divider variant="inset" component="li" />}
            <ListItem 
              alignItems="flex-start"
              sx={{
                py: 2,
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <ListItemAvatar>
                <Avatar 
                  sx={{ 
                    bgcolor: getAvatarColor(index),
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  {index + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="bold">
                    {performer.userName}
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center">
                          <SchoolIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {performer.college || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center">
                          <EmojiEventsIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {performer.eventCount} {performer.eventCount === 1 ? 'Event' : 'Events'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Box display="flex" alignItems="center" mt={1}>
                      <Typography 
                        variant="h6" 
                        color="primary" 
                        fontWeight="bold"
                        sx={{ mr: 2 }}
                      >
                        {performer.totalScore} pts
                      </Typography>
                    </Box>
                    
                    {performer.achievements && performer.achievements.length > 0 && (
                      <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                        {performer.achievements.map((achievement, i) => (
                          <Chip 
                            key={i} 
                            label={achievement} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </React.Fragment>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default TopPerformers;