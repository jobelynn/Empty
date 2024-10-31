// googleFitRoutes.js

// Routes to handle Google Fit functionality 
const express = require('express');
const router = express.Router();
const { getAuthUrl, getAccessToken, getAccessTokenWithRefreshToken, fetchAvgHeartRatePerDay, 
        fetchAvgHeartRatePerMinute, fetchHeartPointsPerDay, fetchHeartPointsPerMinute } = require('../services/google-fit');
const { getRefreshToken, storeRefreshToken } = require('../firebaseModules/firestore');
const { calculate_stress_index, store_heart_rates, STRESS_THRESHOLD } = require('../tests/stress-algo');


// ------------------------------------- Following are routes for the first time user signs-up ---------------------------------------------------

// Given userId, returns url for google authentication ~ userId will be a parameter in the url
router.get('/auth/google', (req, res) => {
    console.log("HTTP GET: /auth/google");
    const { userId } = req.query;
    const authUrl = getAuthUrl(userId);
    res.json({ authUrl });
    console.log("SUCCESS: authUrl returned");
})

// This is the redirect URI set in the google cloud console. Exchanges code for access token & refresh token. Then stores refresh token in firestore
router.get('/oauth2callback', async (req, res) => {
    console.log("HTTP GET: /oauth2callback");
    const { code, state } = req.query;
    const userId = decodeURIComponent(state);
    if (!userId) {
        return res.status(400).json({ error: 'Failed to get userId' });
    }
    console.log("code: " + code);
    console.log("userId: " + userId);
    try { 
        const tokens = await getAccessToken(code);
        const refreshToken = tokens.refresh_token;
        console.log("refreshToken: " + refreshToken);
        await storeRefreshToken(userId, refreshToken);
        console.log("SUCCESS: stored refreshToken");
        res.redirect(`stressapp://oauth2callback`);
        console.log("SUCCESS: redirecting to client");
        return;
    } catch (error) {
        console.error('Error exchanging code for token', error);
        res.status(500).json({ error: 'Failed to exchange code for token' });
    }
});


// ------------------------------------- Following are routes for when the user logs-in ---------------------------------------------------

// Given userId, returns accessToken for google-fit (called upon login and every hour afterwards)
router.get('/get-access-token', async (req, res) => {
    console.log("HTTP GET: /get-access-token");
    const { userId } = req.query;
    const refreshToken = await getRefreshToken(userId); // assume already stored - gotta make sure it is when signing up ~ /oauth2callback route.                                                   
    if (!refreshToken) {
        res.redirect(`api/google-fit/auth/google?userId=${encodeURIComponent(userId)}`);
        console.log("FAILURE: refreshToken does not exist. Initiating google-fit auth process");
        return;
    };
    console.log("SUCCESS: retreived refreshToken");
    const accessToken = await getAccessTokenWithRefreshToken(refreshToken);
    res.json({ accessToken });
    console.log("SUCCESS: sending accessToken to client");
});


// ------------------------------------- Only above routes are being used ---------------------------------------------------


// Redirect root route to /auth/google to initiate authentication
router.get('/', (req, res) => {
    res.redirect('/api/google-fit/auth/google');
})

// Fetch data for baseline calculations (last 14 days)
router.get('/fetch-data/baseline', async (req, res) => {
    try {
        const baselineData = {
            AverageHeartRate: await fetchAvgHeartRatePerDay(),
            DailyHeartpoints: await fetchHeartPointsPerDay(),
        };
        res.json(baselineData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Fetch data for realtime calculations (last 10 minutes)
router.get('/fetch-data/realtime', async (req, res) => {
    try {
        const realtimeData = {
            AverageHeartRate: await fetchAvgHeartRatePerMinute(),
            Heartpoints: await fetchHeartPointsPerMinute(),
        };
        res.json(realtimeData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Calculate Stress Index
router.post('/calculate-stress', async (req, res) => {
    try {
        const { baselineData, realtimeData } = req.body;

        // Extract average heart rate and heart points from realtime data
        const realtimeHeartRate = Object.values(realtimeData.AverageHeartRate)[0];
        const baselineHeartRates = Object.values(baselineData.AverageHeartRate);
        const heartPoint = Object.values(realtimeData.Heartpoints)[0];

        const stressIndex = await calculate_stress_index(baselineHeartRates, realtimeHeartRate, heartPoint);

        res.json(stressIndex);
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate stress index' });
    }
});

module.exports = router;