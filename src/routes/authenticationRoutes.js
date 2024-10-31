// authenticationRoutes.js

// Routes to handle authentication functionality
const express = require('express');
const router = express.Router();
const { signUpUser, loginUser, logoutUser, resetUserPassword, deleteUserByUid, updateUserPassword } = require('../firebaseModules/authentication');

// Base route for authentication
router.get('/', (req, res) => {
    res.send(`<p>Current authentication routes:</p>
              <ul>
                <li>POST /signup - Create a new user</li>
                <li>POST /login - User login</li>
                <li>POST /logout - User logout</li>
                <li>POST /reset-password - Send password reset email</li>
                <li>DELETE /delete-user - Delete a user by UID</li>
              </ul>`);
});

// Create new user with email and password and send verification email
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await signUpUser(email, password);
        console.log("Verification email sent to: ", user.email);
        res.status(201).json({ message: "User created successfully. Verification email sent.", user: { uid: user.uid, email: user.email } });
    } catch (error) {
        console.error("Error signing up: ", error);
        res.status(400).json({ error: error.message });
    }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await loginUser(email, password);

        if (user.emailVerified) {
            console.log("Sign in successful!");
            res.status(200).json({ message: "Sign in successful!", user: { uid: user.uid, email: user.email } });
        } else {
            console.log("Account not verified!");
            res.status(403).json({ error: "Account not verified!" });
        }
    } catch (error) {
        console.error("Error signing in: ", error);
        res.status(400).json({ error: error.message });
    }
});

// User logout
router.post('/logout', async (req, res) => {
    try {
        await logoutUser();
        console.log("User successfully logged out.");
        res.status(200).json({ message: "User successfully logged out." });
    } catch (error) {
        console.error("Error during sign out: ", error);
        res.status(400).json({ error: error.message });
    }
});

// Password Reset
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        await resetUserPassword(email);
        console.log("Password reset email sent to: ", email);
        res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
        console.error("Error sending reset password email", error);
        res.status(400).json({ error: error.message });
    }
});

// Password Change (while logged in)
router.post('/change-password', async (req, res) => {
    const { user, newPassword } = req.body;
    try {
        await updateUserPassword(user, newPassword);
        console.log("Password changed to: ", newPassword);
        res.status(200).json({ message: "Password changed." });
    } catch (error) {
        console.error("Error changing password.", error);
        res.status(400).json({ error: error.message });
    }
});

// Delete User
router.delete('/delete-user', async (req, res) => {
    const { uid } = req.body; // User ID to delete
    try {
        await deleteUserByUid(uid);
        console.log("User successfully deleted.");
        res.status(200).json({ message: "User successfully deleted." });
    } catch (error) {
        console.error("Error deleting user: ", error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;