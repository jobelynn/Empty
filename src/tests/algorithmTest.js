const {
    cal_RRintervals,
    calculate_hrv,
    cal_rmssd,
    calculate_stress_index,
    store_heart_rates,
    calculate_baseline_heartRate,
    store_stress_index, 
    determine_stress_level
} = require('./stress-algo');

const heartRates = [80, 90, 100]; 


function testCalculateBaseline() {
    //console.log("Testing calculate_baseline:");
    for (i = 0; i < heartRates.length; i++) { 
        store_heart_rates(heartRates[i]);
    }
    const baseline = calculate_baseline_heartRate(heartRates);
    console.log(`Calculated Baseline: ${baseline}`);
}


function testCalRRIntervals() {
    //console.log("Testing cal_RRintervals:");
    const rrIntervals = cal_RRintervals(heartRates);
    //console.log(`Calculated RR Intervals: ${rrIntervals}`);
}


function testCalculateHRV() {
    //console.log("Testing calculate_hrv:");
    const rrIntervals = cal_RRintervals(heartRates);
    const hrv = calculate_hrv(rrIntervals);
    //console.log(`Calculated HRV: ${hrv}`);
}

function testCalRMSSD() {
    //console.log("Testing cal_rmssd:");
    const rrIntervals = cal_RRintervals(heartRates);
    const rmssd = cal_rmssd(rrIntervals);
    //console.log(`Calculated RMSSD: ${rmssd}`);
}


async function testCalculateStressIndex() {
    console.log("**Testing calculate_stress_index:");
    console.log(`Heart Rates ${heartRates}`);
    const average_hr = 85; 
    const heart_points = 1; 
    const stressIndex = await calculate_stress_index(1, average_hr, heart_points);
}

async function testNotification() {
    console.log("**Testing high stress:");
    baseline = 0.5
    const average_hr = 120;
    const heart_points = 1; 
    // Tested different heart points & for 'moderate'
    console.log(`Average heart rate ${average_hr}`);
    console.log(`Heart Rates ${heartRates}`);
    const stressIndex = await calculate_stress_index(1, average_hr, heart_points);
    // => notification is triggered  

}

// Run
testCalculateBaseline();
testCalRRIntervals();
testCalculateHRV();
testCalRMSSD();
testCalculateStressIndex();
testNotification();
