import React from 'react';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { AnnouncementForm } from '../components/announcements';

const EditAnnouncementPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/announcements" color="inherit">
            Announcements
          </Link>
          <Typography color="text.primary">Edit</Typography>
        </Breadcrumbs>
      </Box>
      
      <AnnouncementForm />
    </Container>
  );
};

export default EditAnnouncementPage;