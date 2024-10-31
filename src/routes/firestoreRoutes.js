// firestoreRoutes.js

// Firestore routes to handle Firestore functionality 
const express = require('express');
const router = express.Router();
const { 
    addData, 
    getUser, 
    updateData, 
    deleteData, 
    storeStressData, 
    getStressData, 
} = require('../firebaseModules/firestore'); // Adjust the import path as necessary
const { getCurrentStressIndex } = require('../services/google-fit');

// ------------------------------------- Current routes ---------------------------------------------------

// Given userId and accessToken, returns realtime stressIndex and stores in database
router.get('/get/stress-data/realtime', async (req, res) => {
    console.log("HTTP GET: /get/stress-data/realtime");
    try {
        const { userId, accessToken } = req.query;
        const currentStressIndex = getCurrentStressIndex(accessToken);

        const now = new Date();
        const date = now.toISOString().split('T')[0]; // YYYY-MM-DD format
        const time = now.toISOString().slice(11, 16); // HH:MM format
        storeStressData(userId, date, time, currentStressIndex); // store stressIndex
        console.log("SUCCESS: currentStressIndex stored");

        res.json({ currentStressIndex }); // return stressIndex
        console.log("SUCCESS: currentStressIndex returned");
    } catch (error) {
        console.error("Error getting/storing stressIndex: ", error);
        res.status(500).json({ error: 'Failed to return stressIndex' });
    }
});

// Given { userId, email, password }, adds new user in database. (Called when user first signs-up & verifies w/email)
router.post('/add/user', async (req, res) => {
    console.log("HTTP POST: /add/user");
    try {
        const { userId, email, password } = req.body; 
        const userData = { email: email, password: password, refreshToken: null };
        await addData(userId, userData, 'users'); // Use the 'users' collection
        console.log("SUCCESS: created new user in database");
    } catch (error) {
        console.error("Error creating user in database: ", error);
    }
});

// ------------------------------------- Only above routes are being used ---------------------------------------------------



// Route to list current Firestore routes
router.get('/', async (req, res) => {
    res.send(`
        <p>Current Firestore routes:</p>
        <p>/add</p>
        <p>/get/:id</p>
        <p>/update/:id</p>
        <p>/delete/:id</p>
        <p>/store-stress-data</p>
        <p>/get-stress-data/:id</p>
    `);
});


// Route to get user by ID
router.get('/get/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await getUser(userId);
        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).json({ 
                message: "User document does not exist"
            });
        }
    } catch (error) {
        console.error("Error getting user data: ", error);
        res.status(500).json({ error: 'Failed to retrieve user data' });
    }
});

// Route to update user data
router.put('/update/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await updateData(userId, req.body, 'users'); // Update in the 'users' collection
        res.status(200).json({ 
            message: "User document updated successfully" 
        });
    } catch (error) {
        console.error("Error updating document: ", error);
        res.status(500).json({ error: 'Failed to update data' });
    }
});

// Route to delete user data
router.delete('/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await deleteData(userId, 'users'); // Delete from the 'users' collection
        res.status(200).json({ 
            message: "User document deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting document: ", error);
        res.status(500).json({ error: 'Failed to delete data' });
    }
});

// Route to store stress data for a user
router.post('/store-stress-data', async (req, res) => {
    try {
        const { userId, date, time, stressIndex } = req.body; // Expecting { userId, date, time, stressIndex }
        const docId = await storeStressData(userId, date, time, stressIndex);
        res.status(200).json({
            message: "Stress data stored successfully.",
            id: docId
        });
    } catch (error) {
        console.error("Error storing stress data: ", error);
        res.status(500).json({ error: 'Failed to store stress data' });
    }
});

// Route to get stress data for a user
router.get('/get-stress-data/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const stressData = await getStressData(userId);
        res.status(200).json(stressData);
    } catch (error) {
        console.error("Error retrieving stress data: ", error);
        res.status(500).json({ error: 'Failed to retrieve stress data' });
    }
});

// Export router
module.exports = router;