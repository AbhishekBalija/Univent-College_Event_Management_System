import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { leaderboardService, eventService } from "../../services";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Common achievement options
const achievementOptions = [
  "First Place",
  "Second Place",
  "Third Place",
  "Best Presenter",
  "Best Innovation",
  "Best Design",
  "Best Technical Implementation",
  "Best Team Player",
  "Most Creative",
  "Audience Choice",
  "Perfect Attendance",
  "Early Bird",
  "Problem Solver",
  "Quick Learner",
  "Outstanding Contribution",
];

const UpdateScoreForm = ({ eventId, onScoreUpdated }) => {
  const { user } = useSelector((state) => state.auth);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAchievement, setNewAchievement] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    userId: "",
    score: "",
    achievements: [],
  });

  // Fetch event participants
  useEffect(() => {
    const fetchEventParticipants = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);

        // Try to get detailed participant data first
        try {
          const participantsData = await eventService.getEventParticipants(
            eventId
          );
          // console.log("Participants data from API:", participantsData);
          if (participantsData && participantsData.length > 0) {
            // Format participants from the dedicated participants endpoint
            const formattedParticipants = participantsData.map((p) => {
              // Handle different participant data structures
              if (typeof p === "string") {
                return {
                  _id: p,
                  name: "Unknown",
                  email: "No email",
                  college: "Unknown",
                };
              } else if (p.userId) {
                // Get college directly from the participant object
                return {
                  _id: p.userId,
                  name: p.name || "Unknown",
                  email: p.email || "No email",
                  college: p.college || "Unknown",
                };
              } else {
                // Direct user object
                return {
                  _id: p._id || p.id || p,
                  name:
                    p.name ||
                    `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
                    "Unknown",
                  email: p.email || "No email",
                  college: p.college || "Unknown",
                };
              }
            });

            setParticipants(formattedParticipants);
            setLoading(false);
            return; // Exit early if we got the data
          }
        } catch (participantError) {
          console.log(
            "Falling back to event data for participants:",
            participantError
          );
          // Continue to fallback method if this fails
        }

        // Fallback: get participants from event data
        const eventData = await eventService.getEventById(eventId);
        // console.log("Event data from API:", eventData);
        if (eventData && eventData.participants) {
          // console.log("Participants from event data:", eventData.participants);
          // Format participants from event data
          const formattedParticipants = eventData.participants.map((p) => {
            if (typeof p === "object") {
              if (p.userId) {
                // Get college directly from the participant object
                return {
                  _id: p.userId,
                  name: p.name || "Unknown",
                  email: p.email || "No email",
                  college: p.college || "Unknown",
                };
              } else {
                // Direct user object
                return {
                  _id: p._id,
                  name:
                    `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
                    "Unknown",
                  email: p.email || "No email",
                  college: p.college || "Unknown",
                };
              }
            } else {
              return {
                _id: p,
                name: "Unknown",
                email: "No email",
                college: "Unknown",
              };
            }
          });

          setParticipants(formattedParticipants);
        }
      } catch (err) {
        console.error("Error fetching event participants:", err);
        setError("Failed to load participants. Please try again.");
        // Log more details about the error for debugging
        if (err.response) {
          console.error("Error response:", err.response.data);
          console.error("Error status:", err.response.status);
        } else if (err.request) {
          console.error("Error request:", err.request);
        } else {
          console.error("Error message:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventParticipants();
  }, [eventId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle achievements selection
  const handleAchievementsChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      achievements: typeof value === "string" ? value.split(",") : value,
    }));
  };

  // Handle dialog open/close
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Add custom achievement
  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      // Add to form data
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }));

      setNewAchievement("");
      handleCloseDialog();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.userId) {
      setError("Please select a participant");
      return;
    }

    if (
      formData.score === "" ||
      isNaN(formData.score) ||
      Number(formData.score) < 0
    ) {
      setError("Please enter a valid score (must be a positive number)");
      return;
    }

    // Find selected participant
    const selectedParticipant = participants.find(
      (p) => p._id === formData.userId
    );
    if (!selectedParticipant) {
      setError("Selected participant data not found");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      // Construct full score payload
      const scoreData = {
        points: Number(formData.score), // Note: backend expects 'points'
        achievements: formData.achievements,
        userName: selectedParticipant.name,
        // Send the college name exactly as it appears in the user's profile without any modifications
        college: selectedParticipant.college || "Unknown",
      };

      // Log the exact college value being sent to help with debugging
      // console.log("Updating score with college:", scoreData.college);

      // Update participant score
      await leaderboardService.updateParticipantScore(
        eventId,
        formData.userId,
        scoreData
      );

      // Reset form
      setFormData({
        userId: "",
        score: "",
        achievements: [],
      });

      setSuccess("Score updated successfully!");
      if (onScoreUpdated) {
        onScoreUpdated();
      }
    } catch (err) {
      console.error("Error updating score:", err);
      setError(err.message || "Failed to update score. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if user has permission to update scores
  const hasPermission = () => {
    if (!user) return false;
    return user.role === "admin" || user.role === "organizer";
  };

  if (!hasPermission()) {
    return (
      <Alert severity="warning">
        You don't have permission to update participant scores.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Update Participant Score
      </Typography>

      <Divider sx={{ my: 2 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="participant-select-label">Participant</InputLabel>
            <Select
              labelId="participant-select-label"
              id="participant-select"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              label="Participant"
              disabled={submitting}
              required
            >
              {participants.length === 0 ? (
                <MenuItem disabled>No participants found</MenuItem>
              ) : (
                participants.map((participant) => (
                  <MenuItem key={participant._id} value={participant._id}>
                    {participant.name} ({participant.college || "No college"})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Score"
            name="score"
            type="number"
            value={formData.score}
            onChange={handleChange}
            disabled={submitting}
            required
            inputProps={{ min: 0 }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="achievements-label">Achievements</InputLabel>
            <Select
              labelId="achievements-label"
              id="achievements"
              multiple
              name="achievements"
              value={formData.achievements}
              onChange={handleAchievementsChange}
              input={
                <OutlinedInput id="select-achievements" label="Achievements" />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              disabled={submitting}
            >
              {achievementOptions.map((achievement) => (
                <MenuItem key={achievement} value={achievement}>
                  {achievement}
                </MenuItem>
              ))}
              <Divider />
              <MenuItem
                onClick={handleOpenDialog}
                sx={{ color: "primary.main" }}
              >
                <AddCircleOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                Add Custom Achievement
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            sx={{ mt: 3 }}
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Score"}
          </Button>
        </Box>
      )}

      {/* Dialog for adding custom achievement */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Custom Achievement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a custom achievement that's not in the predefined list.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="achievement"
            label="Achievement Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddAchievement} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UpdateScoreForm;
