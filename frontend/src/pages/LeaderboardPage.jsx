import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { eventService } from '../services';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  LeaderboardTable, 
  ParticipantScore,
  TopPerformers,
  CollegeLeaderboard,
  UpdateScoreForm 
} from '../components/leaderboard';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leaderboard-tabpanel-${index}`}
      aria-labelledby={`leaderboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const LeaderboardPage = () => {
  const { eventId } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch event details if eventId is provided
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const eventData = await eventService.getEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Check if user is registered for this event
  const isUserRegistered = () => {
    if (!isAuthenticated || !user || !event) return false;
    return event.participants?.some(participant => participant === user._id);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <MuiLink component={Link} to="/home" color="inherit">
          Home
        </MuiLink>
        {eventId ? (
          <>
            <MuiLink component={Link} to="/events" color="inherit">
              Events
            </MuiLink>
            <MuiLink component={Link} to={`/events/${eventId}`} color="inherit">
              {loading ? 'Loading...' : event?.title || 'Event'}
            </MuiLink>
            <Typography color="text.primary">Leaderboard</Typography>
          </>
        ) : (
          <Typography color="text.primary">Leaderboards</Typography>
        )}
      </Breadcrumbs>

      {/* Page header */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {eventId 
            ? (loading ? 'Loading Event Leaderboard...' : `${event?.title || 'Event'} Leaderboard`) 
            : 'Leaderboards'}
        </Typography>
        {eventId && event && (
          <Typography variant="body1" color="text.secondary">
            Track scores and rankings for this event
          </Typography>
        )}
      </Box>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Event-specific leaderboard */}
      {eventId ? (
        !loading && event && (
          <>
            {/* Show participant score if user is registered */}
            {isAuthenticated && isUserRegistered() && (
              <Box mb={4}>
                <ParticipantScore eventId={eventId} />
              </Box>
            )}
            
            {/* Score update form for organizers/admins */}
            {isAuthenticated && user && (user.role === 'admin' || user.role === 'organizer') && (
              <Box mb={4}>
                <UpdateScoreForm 
                  eventId={eventId} 
                  onScoreUpdated={() => {
                    // Refresh the leaderboard when score is updated
                    // This is a placeholder - you would implement a refresh mechanism
                    window.location.reload();
                  }} 
                />
              </Box>
            )}
            
            {/* Event leaderboard */}
            <LeaderboardTable eventId={eventId} />
          </>
        )
      ) : (
        /* Global leaderboards */
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="leaderboard tabs"
              variant="fullWidth"
            >
              <Tab label="Top Performers" id="leaderboard-tab-0" />
              <Tab label="College Rankings" id="leaderboard-tab-1" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <TopPerformers />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <CollegeLeaderboard />
          </TabPanel>
        </Paper>
      )}
    </Container>
  );
};

export default LeaderboardPage;