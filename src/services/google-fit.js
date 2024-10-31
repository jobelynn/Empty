// google-fit.js 

const { google } = require('googleapis');

// // OAuth2 client setup (DO NOT DELETE)
// const oauth2Client = new google.auth.OAuth2(
//     '307654684535-1hp871kff9v6rumn72dm7ksuuvge0382.apps.googleusercontent.com',     // clientID
//     '',                                                                             // no clientSecret for Android apps
//     'com.abjjrs.stressapp:/oauth2callback'                                          // Custom URI for where Google will redirect users after they authorize the application
// );

// OAuth2 client setup for a website (FOR TESTING PURPOSES)
const oauth2Client = new google.auth.OAuth2(
    '307654684535-631brmre6qc7h3vt1eb6u1jb65hbcu0s.apps.googleusercontent.com',       // clientID
    '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',                                            // clientSecret
    'https://stressapp-abjjrs.onrender.com/api/google-fit/oauth2callback'             // Custom URI for where Google will redirect users after they authorize the application
);

// Generates URL for users to authenticate and grant permissions
const getAuthUrl = (userId) => {
    const scopes = [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.heart_rate.read',    
    ];
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', 
        scope: scopes, 
        state: encodeURIComponent(userId), // userId will be a parameter in the url
    });
    return authUrl;
}

// Retrieve access token after user authorisation 
const getAccessToken = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
};

// Obtain a new access token using the refresh token
const getAccessTokenWithRefreshToken = async (refreshToken) => {
    oauth2Client.setCredentials({refresh_token: refreshToken});
    try {
        const { credentials } = await oauth2Client.refreshAccessToken(); // Automatically gets a new token
        const accessToken = credentials.access_token;
        return accessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
}

// Fetch heart rate data based on given time range (startTime and endTime)
const fetchHeartRateData = async (startTime, endTime, accessToken) => {
    oauth2Client.setCredentials(accessToken);
    const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
    try {
        // Convert the time into nanoseconds (Google Fit API expects timestamps in nanoseconds)
        const datasetId = `${startTime * 1000000}-${endTime * 1000000}`;
        // Heart rate data source ID (com.google.heart_rate.bpm)
        const heartRateDataSourceId = 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm';
        const heartRateDataResponse = await fitness.users.dataSources.datasets.get({
            userId: 'me',
            dataSourceId: heartRateDataSourceId,
            datasetId: datasetId
        });
        const heartRateData = heartRateDataResponse.data;
        return heartRateData;
    } catch (error) {
        console.error('Error fetching heart rate data from Google Fit', error);
        throw error;
    }
};

// Fetch average heart rate per day over last 14 days
const fetchAvgHeartRatePerDay = async (accessToken) => {
    try {
        const endTime = Date.now(); // UTC
        const startTime = endTime - 14 * 24 * 60 * 60 * 1000; // 14 days ago
        const heartRateData = await fetchHeartRateData(startTime, endTime, accessToken);

        const dates = [];
        for (let i = 0; i < 14; i++) {
            const date = new Date(endTime - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // YYYY-MM-DD format
            dates.push(date);
        }
        
        const heartRatesByDay = {};
        heartRateData.point.forEach(point => {
            const startTimeNanos = point.startTimeNanos;
            const heartRate = point.value[0].fpVal; 
            const date = new Date(parseInt(startTimeNanos) / 1000000).toISOString().split('T')[0]; // YYYY-MM-DD format
            if (!heartRatesByDay[date]) {
                heartRatesByDay[date] = [];
            }
            heartRatesByDay[date].push(heartRate);
        });

        const avgHeartRatePerDay = {};
        dates.forEach(date => {
            if (heartRatesByDay[date]) {
                const dailyHeartRates = heartRatesByDay[date];
                const totalHeartRate = dailyHeartRates.reduce((sum, rate) => sum + rate, 0);
                const avgHeartRate = totalHeartRate / dailyHeartRates.length;
                avgHeartRatePerDay[date] = avgHeartRate;
            } else {
                // If no data recorded, set to "N/A"
                avgHeartRatePerDay[date] = "N/A";
            }
        });

        return avgHeartRatePerDay; 
    } catch (error) {
        console.error('Error fetching average heart rate per day', error);
        throw error;
    }
};


// Fetch average heart rate per minute over last 10 minutes
const fetchAvgHeartRatePerMinute = async (accessToken) => {
    try {
        const endTime = Date.now(); // UTC
        const startTime = endTime - 10 * 60 * 1000; // 10 minutes ago
        const heartRateData = await fetchHeartRateData(startTime, endTime, accessToken);

        const minuteIntervals = [];
        for (let i = 0; i < 10; i++) {
            const time = new Date(endTime - i * 60 * 1000).toISOString().slice(0, 16).replace('T','-'); // YYYY-MM-DD-HH:MM format
            minuteIntervals.push(time);
        }

        const heartRatesByMinute = {};
        heartRateData.point.forEach(point => {
            const startTimeNanos = point.startTimeNanos;
            const heartRate = point.value[0].fpVal; 
            const time = new Date(parseInt(startTimeNanos) / 1000000).toISOString().slice(0, 16).replace('T','-'); // YYYY-MM-DD-HH:MM format
            if (!heartRatesByMinute[time]) {
                heartRatesByMinute[time] = [];
            }
            heartRatesByMinute[time].push(heartRate);
        });

        const avgHeartRatePerMinute = {};
        minuteIntervals.forEach(time => {
            if (heartRatesByMinute[time]) {
                const minuteHeartRates = heartRatesByMinute[time];
                const totalHeartRate = minuteHeartRates.reduce((sum, rate) => sum + rate, 0);
                const avgHeartRate = totalHeartRate / minuteHeartRates.length;
                avgHeartRatePerMinute[time] = avgHeartRate;
            } else {
                // If no data recorded, set to "N/A"
                avgHeartRatePerMinute[time] = "N/A";
            }
        });
        return avgHeartRatePerMinute;
    } catch (error) {
        console.error('Error fetching average heart rate per minute', error);
        throw error;
    }
};


// Fetch heart points based on given time range (startTime and endTime)
const fetchHeartPointsData = async (startTime, endTime, accessToken) => {
    oauth2Client.setCredentials(accessToken);
    const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
    try {
        // Convert the time into nanoseconds (Google Fit API expects timestamps in nanoseconds)
        const datasetId = `${startTime * 1000000}-${endTime * 1000000}`;
        // Data source ID for heart points (activity level)
        const heartPointsDataSourceId = 'derived:com.google.heart_minutes:com.google.android.gms:merge_heart_minutes';
        const heartPointsDataResponse = await fitness.users.dataSources.datasets.get({
            userId: 'me',
            dataSourceId: heartPointsDataSourceId,
            datasetId: datasetId
        });
        const heartPointsData = heartPointsDataResponse.data.point.map(point => ({
            startTime: parseInt(point.startTimeNanos, 10) / 1000000, 
            endTime: parseInt(point.endTimeNanos, 10) / 1000000,
            heartPoints: point.value[0].fpVal, 
        }));
        return heartPointsData;
    } catch (error) {
        console.error('Error fetching heart points data from Google Fit', error);
        throw error;
    }
};

// Fetch heart points per day over last 14 days
const fetchHeartPointsPerDay = async (accessToken) => {
    try {
        const endTime = Date.now(); // UTC
        const startTime = endTime - 14 * 24 * 60 * 60 * 1000; // 14 days ago
        const heartPointsData = await fetchHeartPointsData(startTime, endTime, accessToken);

        const dates = [];
        for (let i = 0; i < 14; i++) {
            const date = new Date(endTime - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // YYYY-MM-DD format 
            dates.push(date);
        }

        const heartPointsByDay = {};
        heartPointsData.forEach(({ startTime, heartPoints }) => {
            const date = new Date(startTime).toISOString().split('T')[0]; // Extract the date (YYYY-MM-DD)
            if (!heartPointsByDay[date]) {
                heartPointsByDay[date] = 0;
            }
            heartPointsByDay[date] += heartPoints; 
        });

        const dailyHeartPoints = {};
        dates.forEach(date => {
            dailyHeartPoints[date] = (heartPointsByDay[date] ? heartPointsByDay[date] : 0); 
        })
        return dailyHeartPoints;
    } catch (error) {
        console.error('Error fetching heart points per day', error);
        throw error;
    }
};

// Fetch heart points per minute over last 10 minutes
const fetchHeartPointsPerMinute = async (accessToken) => {
    try {
        const endTime = Date.now(); // UTC
        const startTime = endTime - 10 * 60 * 1000; // 10 minutes ago
        const heartPointsData = await fetchHeartPointsData(startTime, endTime, accessToken);

        const minuteIntervals = [];
        for (let i = 0; i < 10; i++) {
            const time = new Date(endTime - i * 60 * 1000).toISOString().slice(0, 16).replace('T','-'); // YYYY-MM-DD-HH:MM format
            minuteIntervals.push(time);
        }

        const heartPointsByMinute = {};
        heartPointsData.forEach(({ startTime, heartPoints }) => {
            const time = new Date(startTime).toISOString().slice(0, 16).replace('T','-'); // YYYY-MM-DD-HH:MM format
            if (!heartPointsByMinute[time]) {
                heartPointsByMinute[time] = 0;
            }
            heartPointsByMinute[time] += heartPoints; 
        });

        const minutelyHeartPoints = {};
        minuteIntervals.forEach(time => {
            minutelyHeartPoints[time] = (heartPointsByMinute[time] ? heartPointsByMinute[time] : 0);
        })
        
        return minutelyHeartPoints;
    } catch (error) {
        console.error('Error fetching heart points per minute', error);
        throw error;
    }
};

// Given accessToken, return current stressIndex
const getCurrentStressIndex = async (accessToken) => {
    try {
        // fetch datas
        const baselineData = {
            AverageHeartRate: await fetchAvgHeartRatePerDay(accessToken),
            DailyHeartpoints: await fetchHeartPointsPerDay(accessToken),
        };
        const realtimeData = {
            AverageHeartRate: await fetchAvgHeartRatePerMinute(accessToken),
            Heartpoints: await fetchHeartPointsPerMinute(accessToken),
        };

        const realtimeHeartRate = Object.values(realtimeData.AverageHeartRate)[0];
        const baselineHeartRates = Object.values(baselineData.AverageHeartRate);
        const heartPoint = Object.values(realtimeData.Heartpoints)[0];

        const stressIndex = await calculate_stress_index(baselineHeartRates, realtimeHeartRate, heartPoint); // run algo
        return stressIndex;
    } catch (error) {
        console.error('Error calculating stressIndex', error);
        throw error;
    }
};

// Export router
module.exports = {
    getAuthUrl,
    getAccessToken,
    getAccessTokenWithRefreshToken,
    fetchAvgHeartRatePerDay,
    fetchAvgHeartRatePerMinute,
    fetchHeartPointsPerDay,
    fetchHeartPointsPerMinute,
    getCurrentStressIndex,
};