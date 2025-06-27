import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnnouncementList } from '../components/announcements';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, FilterList as FilterListIcon } from '@mui/icons-material';

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState('all');

  const isAdmin = user?.role === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const canCreateAnnouncement = isAdmin || isOrganizer;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateAnnouncement = () => {
    navigate('/announcements/create');
  };

  // Convert filter values to query parameters
  const getFilterParams = () => {
    const params = {};
    
    if (priorityFilter !== 'all') {
      params.priority = priorityFilter;
    }
    
    if (publishedFilter !== 'all' && (isAdmin || isOrganizer)) {
      params.isPublished = publishedFilter === 'published';
    }
    
    return params;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Announcements
          </Typography>
          {canCreateAnnouncement && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateAnnouncement}
            >
              Create Announcement
            </Button>
          )}
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="All Announcements" />
          <Tab label="General Announcements" />
          <Tab label="Event Announcements" />
        </Tabs>
        
        {/* Filters */}
        <Box mb={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} /> Filters:
              </Typography>
            </Grid>
            <Grid item xs={12} sm="auto">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {(isAdmin || isOrganizer) && (
              <Grid item xs={12} sm="auto">
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={publishedFilter}
                    onChange={(e) => setPublishedFilter(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="unpublished">Unpublished</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Box>
        
        {/* Announcement List */}
        {tabValue === 0 && (
          <AnnouncementList 
            showControls={true} 
            filters={getFilterParams()} 
          />
        )}
        
        {tabValue === 1 && (
          <AnnouncementList 
            showControls={true} 
            filters={{ ...getFilterParams(), eventId: null }} 
          />
        )}
        
        {tabValue === 2 && (
          <AnnouncementList 
            showControls={true} 
            filters={{ ...getFilterParams(), hasEvent: true }} 
          />
        )}
      </Paper>
    </Container>
  );
};

export default AnnouncementsPage;