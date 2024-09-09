import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Card, CardContent, CircularProgress, Container, Grid, IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

type Class = {
  id: string;
  name: string;
  description: string;
  role: string;
  image: string;
};

const App: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [likesDislikes, setLikesDislikes] = useState<{ [key: string]: [number, number] }>({});

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const result = await backend.getClasses();
      setClasses(result);
      setSelectedClass(result[0]);
      setLoading(false);
      fetchLikesDislikes(result);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const fetchLikesDislikes = async (classes: Class[]) => {
    const likesDislikesData: { [key: string]: [number, number] } = {};
    for (const cls of classes) {
      try {
        const result = await backend.getLikesDislikes(cls.id);
        if ('ok' in result) {
          likesDislikesData[cls.id] = result.ok;
        }
      } catch (error) {
        console.error(`Error fetching likes/dislikes for ${cls.id}:`, error);
      }
    }
    setLikesDislikes(likesDislikesData);
  };

  const handleLike = async (classId: string) => {
    try {
      await backend.likeClass(classId);
      fetchLikesDislikes(classes);
    } catch (error) {
      console.error('Error liking class:', error);
    }
  };

  const handleDislike = async (classId: string) => {
    try {
      await backend.dislikeClass(classId);
      fetchLikesDislikes(classes);
    } catch (error) {
      console.error('Error disliking class:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Final Fantasy 14 Classes
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h5" gutterBottom>
            Class List
          </Typography>
          {classes.map((cls) => (
            <Card key={cls.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => setSelectedClass(cls)}>
              <CardContent>
                <Typography variant="h6">{cls.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {cls.role}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedClass && (
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {selectedClass.name}
                </Typography>
                <img
                  src={selectedClass.image}
                  alt={selectedClass.name}
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginBottom: '1rem' }}
                />
                <Typography variant="h6" gutterBottom>
                  Role: {selectedClass.role}
                </Typography>
                <Typography variant="body1" paragraph>
                  {selectedClass.description}
                </Typography>
                <Box display="flex" alignItems="center">
                  <IconButton onClick={() => handleLike(selectedClass.id)} color="primary">
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography variant="body2">
                    {likesDislikes[selectedClass.id] ? likesDislikes[selectedClass.id][0] : 0}
                  </Typography>
                  <IconButton onClick={() => handleDislike(selectedClass.id)} color="secondary">
                    <ThumbDownIcon />
                  </IconButton>
                  <Typography variant="body2">
                    {likesDislikes[selectedClass.id] ? likesDislikes[selectedClass.id][1] : 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
