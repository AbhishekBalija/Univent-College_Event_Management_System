import React, { useState, useEffect } from 'react';
import { announcementService } from '../../services';
import { useSocket } from '../../context/SocketContext';
import {
  Box,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  NotificationsActive as NotificationsActiveIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/useAuth';

const priorityColors = {
  low: 'info',
  medium: 'warning',
  high: 'error'
};

// eslint-disable-next-line no-unused-vars
const EventAnnouncements = ({ eventId, eventTitle }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    eventId: null
  });
  const [editMode, setEditMode] = useState(false);
  const [currentAnnouncementId, setCurrentAnnouncementId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  
  const { user } = useAuth();
  const { socket, connected, joinEventRoom, leaveEventRoom } = useSocket();
  
  const isAdmin = user?.role === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const canModify = isAdmin || isOrganizer;

  useEffect(() => {
    fetchAnnouncements();
    
    // Join event room for real-time updates
    if (socket && connected && eventId) {
      joinEventRoom(eventId);
    }
    
    return () => {
      // Leave event room when component unmounts
      if (socket && connected && eventId) {
        leaveEventRoom(eventId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, socket, connected]);

  useEffect(() => {
    if (!socket || !connected) return;

    // Listen for new announcements
    const handleNewAnnouncement = (data) => {
      if (data.announcement.eventId === eventId) {
        setAnnouncements(prev => [data.announcement, ...prev]);
      }
    };

    // Listen for updated announcements
    const handleUpdateAnnouncement = (data) => {
      if (data.announcement.eventId === eventId) {
        setAnnouncements(prev => 
          prev.map(a => a._id === data.announcement._id ? data.announcement : a)
        );
      }
    };

    // Listen for deleted announcements
    const handleDeleteAnnouncement = (data) => {
      setAnnouncements(prev => 
        prev.filter(a => a._id !== data.id)
      );
    };

    socket.on('newAnnouncement', handleNewAnnouncement);
    socket.on('updateAnnouncement', handleUpdateAnnouncement);
    socket.on('deleteAnnouncement', handleDeleteAnnouncement);

    return () => {
      socket.off('newAnnouncement', handleNewAnnouncement);
      socket.off('updateAnnouncement', handleUpdateAnnouncement);
      socket.off('deleteAnnouncement', handleDeleteAnnouncement);
    };
  }, [socket, connected, eventId]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await announcementService.getAnnouncementsByEvent(eventId);
      setAnnouncements(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      eventId
    });
    setEditMode(false);
    setCurrentAnnouncementId(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (editMode && currentAnnouncementId) {
        await announcementService.updateAnnouncement(currentAnnouncementId, formData);
      } else {
        await announcementService.createAnnouncement(formData);
      }
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'Failed to save announcement');
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      eventId: announcement.eventId
    });
    setEditMode(true);
    setCurrentAnnouncementId(announcement._id);
    setOpenDialog(true);
  };

  const handleDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await announcementService.deleteAnnouncement(selectedAnnouncement._id);
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to delete announcement');
      setDeleteDialogOpen(false);
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
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2">
          Announcements
        </Typography>
        {canModify && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            size="small"
          >
            New Announcement
          </Button>
        )}
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {announcements.length === 0 ? (
        <Alert severity="info">
          No announcements for this event yet.
        </Alert>
      ) : (
        <Box>
          {announcements.map((announcement) => (
            <Paper 
              key={announcement._id} 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2, 
                borderLeft: announcement.priority === 'high' ? '4px solid #f44336' : 
                          announcement.priority === 'medium' ? '4px solid #ff9800' : 
                          '4px solid #2196f3'
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box display="flex" alignItems="center">
                      {announcement.priority === 'high' ? (
                        <NotificationsActiveIcon color="error" sx={{ mr: 1 }} />
                      ) : (
                        <NotificationsIcon 
                          color={announcement.priority === 'medium' ? 'warning' : 'info'} 
                          sx={{ mr: 1 }} 
                        />
                      )}
                      <Typography variant="h6">
                        {announcement.title}
                      </Typography>
                    </Box>
                    {canModify && (
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(announcement)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(announcement)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {announcement.content}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Posted by {announcement.creatorName} • {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                    </Typography>
                    <Chip 
                      label={announcement.priority} 
                      color={priorityColors[announcement.priority]} 
                      size="small" 
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      )}
      
      {/* Create/Edit Announcement Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Announcement' : 'Create New Announcement'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
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
                  rows={4}
                />
              </Grid>
              
              <Grid item xs={12}>
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
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the announcement "{selectedAnnouncement?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EventAnnouncements;