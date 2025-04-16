// login.js
const express = require('express');
const fs = require('fs');
const router = express.Router();

const DB_FILE = './users.txt';

router.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Server error reading file' });
    }

    const users = data.trim().split('\n');
    const userFound = users.find(line => {
      const [user, pass, userRole] = line.split('|');
      return user === username && pass === password && userRole === role;
    });

    if (userFound) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

module.exports = router;
