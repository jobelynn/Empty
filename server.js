// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware 
app.use(cors()); // later will allow ReactNative frontend to make requests here
app.use(bodyParser.json());

// Importing the Google Fit routes
// Refer to googleFitRoutes.js for requests related to Google Fit
const googleFitRoutes = require('./src/routes/googleFitRoutes');
app.use('/api/google-fit', googleFitRoutes);

// Importing the Firestore routes
// Refer to firestoreRoutes.js for requests related to database management
const firestoreRoutes = require('./src/routes/firestoreRoutes');
app.use('/api/firestore', firestoreRoutes);

// Importing the Authentication routes
// Refer to authenticationRoutes.js for requests related to authentication
const authenticationRoutes = require('./src/routes/authenticationRoutes');
app.use('/api/authentication', authenticationRoutes);

// Startup message
app.get('/', (req, res) => {
    res.send(`<p>Welcome test message.</p>
              <p>Go to /api/google-fit for Google Fit process.</p>
              <p>Go to /api/firestore for database actions.</p>`
    );
});

// Start server
app.listen(port, () => console.log(`Server is running on ${port}`));

