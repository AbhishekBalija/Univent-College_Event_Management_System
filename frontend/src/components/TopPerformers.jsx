import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Stack,
  Paper,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { leaderboardService } from "../services";

const TopPerformers = () => {
  const [performers, setPerformers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        const data = await leaderboardService.getTopPerformers();
        setPerformers(data.slice(0, 5)); // Only show top 5
      } catch (err) {
        console.error("Failed to fetch top performers:", err);
      }
    };

    fetchTopPerformers();
  }, []);

  const getPosition = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}th`;
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 800, mx: "auto", mt: 3 }}>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {performers.map((performer, index) => (
          <ListItem
            key={performer.userId || index}
            alignItems="center"
            sx={{
              py: 2,
              "&:hover": {
                bgcolor: "action.hover",
                cursor: "pointer",
              },
            }}
            onClick={() => navigate(`/profile/${performer.userId}`)}
            secondaryAction={
              <IconButton edge="end" size="small">
                <NavigateNextIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: index < 3 ? "warning.main" : "grey.400" }}>
                <TrophyIcon />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              disableTypography
              primary={
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  component="div"
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    component="div"
                  >
                    {performer.userName}
                  </Typography>
                  <Chip
                    label={getPosition(index)}
                    color={index < 3 ? "warning" : "default"}
                    size="small"
                  />
                </Stack>
              }
              secondary={
                <Stack
                  direction="row"
                  spacing={2}
                  divider={<Divider orientation="vertical" flexItem />}
                  sx={{ mt: 1 }}
                  component="div"
                >
                  <Typography variant="body2" component="span">
                    Events: {performer.eventCount}
                  </Typography>
                  <Typography variant="body2" component="span">
                    Score: {performer.totalScore}
                  </Typography>
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TopPerformers;
