const { app } = require("../index");
const { getFirestore, collection, doc, getDoc, addDoc, updateDoc, deleteDoc, getDocs, setDoc } = require("firebase/firestore");

// initialize Firestore
const db = getFirestore(app);

// add data
const addData = async (userId, data, collectionName) => {
    try {
        // sets userId as document ID
        const docRef = doc(db, collectionName, userId); 
        
        await setDoc(docRef, data, { merge: true }); 
        console.log("Data added with ID: ", userId);
        return userId;
    } catch (error) {
        console.error("Error adding data: ", error);
        throw error;
    }
};

// get user by id
const getUser = async (userId) => {
    try {
        const docRef = doc(db, "users", userId); 
        const userDoc = await getDoc(docRef);
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log("No such user document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting user data: ", error);
        throw error;
    }
};

// function to store a refresh token for a user
const storeRefreshToken = async (userId, refreshToken) => {
    try {
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, { refreshToken: refreshToken });
        console.log("Refresh token stored successfully.");
    } catch (error) {
        console.error("Error storing refresh token: ", error);
        throw error;
    }
};

// function to retrieve the refresh token for a user
const getRefreshToken = async (userId) => {
    try {
        const userData = await getUser(userId);
        return userData && userData.refreshToken
            ? userData.refreshToken
            : null;
    } catch (error) {
        console.error("Error retrieving refresh token: ", error);
        throw error;
    }
};

// store stress data for a user
const storeStressData = async (userId, date, time, stressIndex) => {
    try {
        const stressEntry = {
            timestamp: `${date},${time}`,
            stressIndex,
        };
        const docRef = await addDoc(collection(db, `users/${userId}/stressData`), stressEntry);
        console.log("Stress data stored with ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error storing stress data:", error);
        throw error;
    }
};

// stress data format
const getStressData = async (userId) => {
    try {
        const stressCollectionRef = collection(db, `users/${userId}/stressData`);
        const stressSnapshot = await getDocs(stressCollectionRef);
        const stressList = stressSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        
        return stressList.map(entry => `${entry.timestamp}:\n${entry.stressIndex}`);
    } catch (error) {
        console.error("Error retrieving stress data:", error);
        throw error;
    }
};

// firestore function to update general data 
const updateData = async (docId, newData, collectionName) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, newData);
        console.log("Document successfully updated!");
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
};

// delete data
const deleteData = async (docId, collectionName) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error deleting document: ", error);
        throw error;
    }
};

module.exports = {
    addData,
    getUser,
    storeRefreshToken,
    getRefreshToken,
    storeStressData,
    getStressData,
    updateData,
    deleteData,
};