import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { announcementService } from '../../services';
import { useAuth } from '../../context/useAuth';
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
       <Card
       key={announcement._id}
       elevation={4}
       sx={{
         mb: 3,
         borderRadius: 3,
         background: 'rgba(255, 255, 255, 0.7)',
         backdropFilter: 'blur(6px)',
         border: '1px solid #e0e0e0',
         transition: 'all 0.3s ease',
         '&:hover': {
           boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
           transform: 'translateY(-2px)'
         }
       }}
     >
       {!announcement.isPublished && (
         <Chip
           label="Unpublished"
           size="small"
           color="warning"
           sx={{
             position: 'absolute',
             top: 12,
             right: 12,
             opacity: 0.9,
             fontWeight: 500,
             textTransform: 'uppercase'
           }}
         />
       )}
       <CardContent>
         <Stack spacing={2}>
           {/* Title + Icon */}
           <Stack direction="row" alignItems="center" spacing={1}>
             {announcement.priority === 'high' ? (
               <NotificationsActiveIcon color="error" />
             ) : announcement.priority === 'medium' ? (
               <NotificationsIcon color="warning" />
             ) : (
               <NotificationsIcon color="info" />
             )}
             <Typography variant="h6" fontWeight={600}>
               {announcement.title}
             </Typography>
           </Stack>
     
           {/* Content */}
           <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
             {announcement.content}
           </Typography>
     
           <Divider />
     
           {/* Footer Row */}
           <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
             <Box display="flex" alignItems="center" gap={1}>
               <Chip
                 label={announcement.priority}
                 color={priorityColors[announcement.priority]}
                 size="small"
                 sx={{
                   textTransform: 'capitalize',
                   fontWeight: 500,
                   px: 1.5,
                   py: 0.5,
                   borderRadius: 2
                 }}
               />
               <Typography variant="caption" color="text.secondary">
                 By {announcement.creatorName} •{' '}
                 {formatDistanceToNow(new Date(announcement.createdAt), {
                   addSuffix: true
                 })}
               </Typography>
             </Box>
     
             {/* Controls */}
             {showControls && canModify && (
               <Stack direction="row" spacing={1}>
                 <IconButton
                   size="small"
                   onClick={() => togglePublishStatus(announcement)}
                   color={announcement.isPublished ? 'success' : 'default'}
                   title={announcement.isPublished ? 'Unpublish' : 'Publish'}
                 >
                   {announcement.isPublished ? <NotificationsIcon /> : <NotificationsOffIcon />}
                 </IconButton>
                 <IconButton size="small" onClick={() => handleEdit(announcement)} color="primary">
                   <EditIcon />
                 </IconButton>
                 <IconButton size="small" onClick={() => handleDelete(announcement)} color="error">
                   <DeleteIcon />
                 </IconButton>
               </Stack>
             )}
           </Stack>
         </Stack>
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