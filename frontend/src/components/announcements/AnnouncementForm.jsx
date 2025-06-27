import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { announcementService, eventService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Autocomplete,
  FormControlLabel,
  Switch,
  Divider
} from '@mui/material';

const AnnouncementForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const isEditMode = Boolean(id);
  
  // Initialize with data from location state if available (for edit mode)
  const initialData = location.state?.announcement || {
    title: '',
    content: '',
    eventId: null,
    priority: 'medium',
    isPublished: true
  };

  const [formData, setFormData] = useState(initialData);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If in edit mode and no state was passed, fetch the announcement
    if (isEditMode && !location.state?.announcement) {
      fetchAnnouncement();
    }
    
    // Fetch events for the dropdown
    fetchEvents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAnnouncement = async () => {
    setLoading(true);
    try {
      const response = await announcementService.getAnnouncementById(id);
      setFormData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch announcement');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvents();
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    // Handle checkbox fields
    if (name === 'isPublished') {
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, eventId: newValue?._id || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditMode) {
        await announcementService.updateAnnouncement(id, formData);
      } else {
        await announcementService.createAnnouncement(formData);
      }
      
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/announcements');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to save announcement');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {isEditMode ? 'Edit Announcement' : 'Create New Announcement'}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Announcement {isEditMode ? 'updated' : 'created'} successfully!
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 100 }}
              helperText={`${formData.title.length}/100 characters`}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              multiline
              rows={6}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={events}
              getOptionLabel={(option) => option.title || ''}
              value={events.find(event => event._id === formData.eventId) || null}
              onChange={handleEventChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Related Event (Optional)"
                  helperText="Leave empty for general announcements"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
              <FormHelperText>
                Set the importance level of this announcement
              </FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublished}
                  onChange={handleChange}
                  name="isPublished"
                  color="primary"
                />
              }
              label="Publish immediately"
            />
            <FormHelperText>
              {formData.isPublished 
                ? 'Announcement will be visible to all users' 
                : 'Announcement will be saved as draft'}
            </FormHelperText>
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/announcements')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={submitting}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                'Update Announcement'
              ) : (
                'Create Announcement'
              )}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AnnouncementForm;