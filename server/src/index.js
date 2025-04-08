import express from 'express';
import cors from 'cors';
import { authenticateUser, getAllUsers, createUser, updateUser, deleteUser } from './db.js';
import { getShows, createShow, updateShow, deleteShow, 
         getSchedule, createScheduleItem, updateScheduleItem, deleteScheduleItem } from './showsDb.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await updateUser(parseInt(req.params.id), req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await deleteUser(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Shows
app.get('/api/shows', async (req, res) => {
  try {
    const shows = await getShows();
    res.json(shows);
  } catch (error) {
    console.error('Error getting shows:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/shows', async (req, res) => {
  try {
    const show = await createShow(req.body);
    res.status(201).json(show);
  } catch (error) {
    console.error('Error creating show:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/shows/:id', async (req, res) => {
  try {
    const show = await updateShow(parseInt(req.params.id), req.body);
    if (show) {
      res.json(show);
    } else {
      res.status(404).json({ error: 'Show not found' });
    }
  } catch (error) {
    console.error('Error updating show:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/shows/:id', async (req, res) => {
  try {
    await deleteShow(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting show:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Schedule
app.get('/api/schedule', async (req, res) => {
  try {
    const schedule = await getSchedule();
    res.json(schedule);
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/schedule', async (req, res) => {
  try {
    const scheduleItem = await createScheduleItem(req.body);
    res.status(201).json(scheduleItem);
  } catch (error) {
    console.error('Error creating schedule item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/schedule/:id', async (req, res) => {
  try {
    const scheduleItem = await updateScheduleItem(parseInt(req.params.id), req.body);
    if (scheduleItem) {
      res.json(scheduleItem);
    } else {
      res.status(404).json({ error: 'Schedule item not found' });
    }
  } catch (error) {
    console.error('Error updating schedule item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/schedule/:id', async (req, res) => {
  try {
    await deleteScheduleItem(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting schedule item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 