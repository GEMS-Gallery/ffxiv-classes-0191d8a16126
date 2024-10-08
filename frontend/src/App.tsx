import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { AppBar, Box, Card, CardContent, CardMedia, CircularProgress, Container, Grid, IconButton, Toolbar, Typography, Pagination } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

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
  const [page, setPage] = useState(1);
  const classesPerPage = 6;

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

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const paginatedClasses = classes.slice((page - 1) * classesPerPage, page * classesPerPage);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <SportsEsportsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Final Fantasy XIV Job Classes
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              Job Class List
            </Typography>
            {paginatedClasses.map((cls) => (
              <Card key={cls.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => setSelectedClass(cls)}>
                <CardContent>
                  <Typography variant="h6">{cls.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cls.role}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            <Pagination
              count={Math.ceil(classes.length / classesPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            {selectedClass && (
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={selectedClass.image}
                  alt={selectedClass.name}
                />
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {selectedClass.name}
                  </Typography>
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
    </Box>
  );
};

export default App;
