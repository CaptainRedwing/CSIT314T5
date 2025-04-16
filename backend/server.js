import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;
const __dirname = path.resolve();

const corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Function to read users from text file
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'users.txt'), 'utf8');
    const lines = data.split('\n');
    const users = [];
    
    for (const line of lines) {
      // Skip comments and empty lines
      if (line.trim() === '' || line.startsWith('#')) continue;
      
      const [accountType, username, password, role] = line.split('|').map(item => item.trim());
      users.push({ accountType, username, password, role });
    }
    
    return users;
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { accountType, useraccount, password } = req.body;

  // Basic validation
  if (!useraccount || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Read users from file
  const users = readUsersFromFile();
  
  // Find user
  const user = users.find(u => 
    u.username === useraccount && 
    u.accountType === accountType
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check password (in real app, compare hashed passwords)
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Return user data (without password)
  const userData = {
    username: user.username,
    role: user.role,
    accountType: user.accountType
  };

  res.json({
    message: 'Login successful',
    user: {
      username: user.username,
      role: user.role,  // Make sure this matches your role system
      accountType: user.accountType
    },
    token: 'mock-jwt-token'
  });
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});