const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));
app.post('/login', async(req, res) => {
    console.log(req);
})
app.post('/signup', async(req, res) => {
    console.log(req);
})
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});