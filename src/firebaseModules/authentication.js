// authentication.js

const { app } = require("../index");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, deleteUser, updatePassword } = require("firebase/auth");

// Initialize Firebase Authentication and auth instance
const auth = getAuth(app);

// Function to create a new user and send verification email
const signUpUser = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);
    return user;
};

// Function to log in a user
const loginUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
};

// Function to log out a user
const logoutUser = async () => {
    await signOut(auth);
};

// Function to send password reset email
const resetUserPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
};

// Function to update password (user must be logged in)
const updateUserPassword = async (user, newPassword) => {
    await updatePassword(user, newPassword);
};

// Function to delete a user by email
const deleteUserByUid = async (uid) => {
    const user = await auth.getUser(uid);
    await deleteUser(user.uid);
};

module.exports = {
    signUpUser,
    loginUser,
    logoutUser,
    resetUserPassword,
    updateUserPassword,
    deleteUserByUid,
};