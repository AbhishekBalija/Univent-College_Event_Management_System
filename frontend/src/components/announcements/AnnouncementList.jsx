import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { announcementService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const priorityColors = {
  low: 'info',
  medium: 'warning',
  high: 'error'
};

const AnnouncementList = ({ eventId, showControls = false }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';
  const isOrganizer = user?.role === 'organizer';
  const canModify = isAdmin || isOrganizer;

  useEffect(() => {
    fetchAnnouncements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (eventId) {
        response = await announcementService.getAnnouncementsByEvent(eventId);
      } else {
        response = await announcementService.getAllAnnouncements();
      }
      setAnnouncements(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    navigate(`/announcements/edit/${announcement._id}`, { state: { announcement } });
  };

  const handleDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await announcementService.deleteAnnouncement(selectedAnnouncement._id);
      setAnnouncements(announcements.filter(a => a._id !== selectedAnnouncement._id));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to delete announcement');
      setDeleteDialogOpen(false);
    }
  };

  const togglePublishStatus = async (announcement) => {
    try {
      const updatedAnnouncement = await announcementService.updateAnnouncement(
        announcement._id,
        { isPublished: !announcement.isPublished }
      );
      setAnnouncements(announcements.map(a => 
        a._id === announcement._id ? updatedAnnouncement.data : a
      ));
    } catch (err) {
      setError(err.message || 'Failed to update announcement');
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

  if (announcements.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No announcements available.
      </Alert>
    );
  }

  return (
    <Box>
      {announcements.map((announcement) => (
        <Card key={announcement._id} sx={{ mb: 2, position: 'relative' }}>
          {!announcement.isPublished && (
            <Chip 
              label="Unpublished" 
              color="default" 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                opacity: 0.7
              }} 
            />
          )}
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  {announcement.priority === 'high' ? (
                    <NotificationsActiveIcon color="error" />
                  ) : announcement.priority === 'medium' ? (
                    <NotificationsIcon color="warning" />
                  ) : (
                    <NotificationsIcon color="info" />
                  )}
                  <Typography variant="h6" component="div">
                    {announcement.title}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {announcement.content}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Stack 
                  direction="row" 
                  justifyContent="space-between" 
                  alignItems="center"
                  flexWrap="wrap"
                  spacing={1}
                >
                  <Box>
                    <Chip 
                      label={announcement.priority} 
                      color={priorityColors[announcement.priority]} 
                      size="small" 
                      sx={{ mr: 1 }} 
                    />
                    <Typography variant="caption" color="text.secondary" component="span">
                      By {announcement.creatorName} • {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                  {showControls && canModify && (
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        size="small" 
                        onClick={() => togglePublishStatus(announcement)}
                        color={announcement.isPublished ? "success" : "default"}
                        title={announcement.isPublished ? "Unpublish" : "Publish"}
                      >
                        {announcement.isPublished ? <NotificationsIcon /> : <NotificationsOffIcon />}
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(announcement)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(announcement)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

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
    </Box>
  );
};

export default AnnouncementList;