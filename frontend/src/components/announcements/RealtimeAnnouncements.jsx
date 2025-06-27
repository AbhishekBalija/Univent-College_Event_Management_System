import React, { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
// eslint-disable-next-line no-unused-vars
import { announcementService } from '../../services';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Slide,
  IconButton,
  Divider
} from '@mui/material';
import { Close as CloseIcon, NotificationsActive as NotificationsActiveIcon } from '@mui/icons-material';

const RealtimeAnnouncements = ({ eventId = null }) => {
  const { socket, connected } = useSocket();
  const [notification, setNotification] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!socket || !connected) return;

    // Join event room if eventId is provided
    if (eventId) {
      socket.emit('joinEvent', eventId);
    }

    // Listen for new announcements
    socket.on('newAnnouncement', (data) => {
      // Only show announcements for this event or general announcements
      if (!data.announcement.eventId || data.announcement.eventId === eventId) {
        setNotification(data.announcement);
        setOpen(true);
      }
    });

    // Listen for updated announcements
    socket.on('updateAnnouncement', (data) => {
      // Only show announcements for this event or general announcements
      if (!data.announcement.eventId || data.announcement.eventId === eventId) {
        setNotification({
          ...data.announcement,
          updated: true
        });
        setOpen(true);
      }
    });

    // Clean up
    return () => {
      socket.off('newAnnouncement');
      socket.off('updateAnnouncement');
      
      // Leave event room if eventId is provided
      if (eventId) {
        socket.emit('leaveEvent', eventId);
      }
    };
  }, [socket, connected, eventId]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Slide}
    >
      <Paper 
        elevation={4} 
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 2,
          borderLeft: notification?.priority === 'high' ? '4px solid #f44336' : 
                     notification?.priority === 'medium' ? '4px solid #ff9800' : 
                     '4px solid #2196f3'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center">
            <NotificationsActiveIcon 
              color={notification?.priority === 'high' ? 'error' : 
                    notification?.priority === 'medium' ? 'warning' : 
                    'info'} 
              sx={{ mr: 1 }} 
            />
            <Typography variant="subtitle1" component="div" fontWeight="bold">
              {notification?.updated ? 'Announcement Updated' : 'New Announcement'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="body1" fontWeight="medium" gutterBottom>
          {notification?.title}
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          {notification?.content.length > 150 
            ? `${notification?.content.substring(0, 150)}...` 
            : notification?.content}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            By {notification?.creatorName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {notification?.priority} priority
          </Typography>
        </Box>
      </Paper>
    </Snackbar>
  );
};

export default RealtimeAnnouncements;