const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize app
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (Replace with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/react-crud', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const User = mongoose.model('User', userSchema);

// Routes

// Create a new user
app.post('/users', async (req, res) => {
  const { name, email, age } = req.body;
  const newUser = new User({ name, email, age });
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: 'Unable to save user' });
  }
});

// Read all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch users' });
  }
});

// Update user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Unable to update user' });
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete user' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
