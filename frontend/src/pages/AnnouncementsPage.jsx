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
  Stack,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState('all');

  const isAdmin = user?.role === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const canCreateAnnouncement = isAdmin || isOrganizer;

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleCreateAnnouncement = () => navigate('/announcements/create');

  const getFilterParams = () => {
    const params = {};
    if (priorityFilter !== 'all') params.priority = priorityFilter;
    if (publishedFilter !== 'all' && (isAdmin || isOrganizer)) {
      params.isPublished = publishedFilter === 'published';
    }
    return params;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight={600}>
            📢 Announcements
          </Typography>
          {canCreateAnnouncement && (
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateAnnouncement}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Create
            </Button>
          )}
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          sx={{
            mb: 3,
            borderRadius: 2,
            backgroundColor: '#f7f9fc'
          }}
        >
          <Tab label="All Announcements" />
          <Tab label="General Announcements" />
          <Tab label="Event Announcements" />
        </Tabs>

        {/* Filters */}
        <Paper
          elevation={1}
          sx={{
            backgroundColor: '#f0f4f9',
            p: 2,
            mb: 4,
            borderRadius: 2
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
            <Chip
              icon={<FilterListIcon />}
              label="Filters"
              color="default"
              sx={{ fontWeight: 500, backgroundColor: '#e0e7ff' }}
            />

            <FormControl size="small" sx={{ minWidth: 160 }}>
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

            {(isAdmin || isOrganizer) && (
              <FormControl size="small" sx={{ minWidth: 160 }}>
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
            )}
          </Stack>
        </Paper>

        {/* Announcement List */}
        <Box mt={1}>
          {tabValue === 0 && (
            <AnnouncementList showControls filters={getFilterParams()} />
          )}
          {tabValue === 1 && (
            <AnnouncementList showControls filters={{ ...getFilterParams(), eventId: null }} />
          )}
          {tabValue === 2 && (
            <AnnouncementList showControls filters={{ ...getFilterParams(), hasEvent: true }} />
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AnnouncementsPage;
