const { 
  addData, 
  getUser, 
  storeRefreshToken, 
  getRefreshToken, 
  storeStressData, 
  getStressData, 
  updateData, 
  deleteData 
} = require("../firebaseModules/firestore");

// Test data
const testUserId = "darrenStyles";
const testUserData = { name: "Darren Styles", age: 32, email: "darren.styles@example.com", password: "awesomesauce" };
const newRefreshToken = "updatedRefreshToken654321";
const testStressData1 = { date: "2024-10-25", time: "09:30", stressIndex: 4 };
const testStressData2 = { date: "2024-10-26", time: "16:45", stressIndex: 6 };
const updatedUserData = { age: 105 }; // Update age
const collectionName = "users";

// Function to run all tests
const runTests = async () => {
  try {
      // adding data
      console.log("Testing addData...");
      const userId = await addData(testUserId, testUserData, collectionName); // Explicitly using testUserId
      
      // user data
      console.log("Testing getUser...");
      const user = await getUser(userId);
      console.log("User data retrieved:", user);
      
      // storing refresh token
      console.log("Testing storeRefreshToken...");
      await storeRefreshToken(userId, newRefreshToken);

      //retrieving refresh token
      console.log("Testing getRefreshToken...");
      const refreshToken = await getRefreshToken(userId);
      console.log("Retrieved refresh token:", refreshToken);

      // storing stress data for the user
      console.log("Testing storeStressData...");
      const stressDataId1 = await storeStressData(userId, testStressData1.date, testStressData1.time, testStressData1.stressIndex);
      const stressDataId2 = await storeStressData(userId, testStressData2.date, testStressData2.time, testStressData2.stressIndex);
      console.log("Stored stress data with IDs:", stressDataId1, stressDataId2);

      //  retrieving stress data
      console.log("Testing getStressData...");
      const stressDataList = await getStressData(userId);
      console.log("Retrieved stress data list:", stressDataList);

      //updating user data
      console.log("Testing updateData...");
      await updateData(userId, updatedUserData, collectionName);
      const updatedUser = await getUser(userId);
      console.log("Updated user data:", updatedUser);

      // Test deleting user data
      // console.log("Testing deleteData...");
      // await deleteData(userId, collectionName);
      // const deletedUser = await getUser(userId);
      // console.log("Deleted user data should be null:", deletedUser);
  } catch (error) {
      console.error("Error during tests:", error);
  }
};

runTests();