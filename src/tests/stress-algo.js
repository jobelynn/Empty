
const STRESS_THRESHOLD = 1.5;

let heartRates = []
let stressArray = []

const STRESS_LEVELS = {
    LOW: { range: [0, 0.7], label: "Low"},
    MODERATE: { range: [0.7, 0.9], label: "Moderate"},
    HIGH: { range: [0.9, Infinity], label: "High"}
};

// Cal intervals between heartrates 
function cal_RRintervals(heartRates) { 
    return heartRates.map(hr => Math.round(60000 / hr));
}

function calculate_hrv(rr_intervals) {
    if (rr_intervals.length < 2) { 
        throw new Error("Not enough intervals to calculate hrv")
    }

    // Calculate mean 
    totalRR = 0; 
    for (let i = 0; i < rr_intervals.length; i++) { 
        totalRR += rr_intervals[i];
    }
    const meanRR = totalRR / rr_intervals.length;

    // Calculate Sdnn aka hrv
    let variance = 0; 
    for (let i = 0; i < rr_intervals.length; i++) { 
        const diff = rr_intervals[i] - meanRR;
        variance += diff * diff; 
    }
    variance /= rr_intervals.length; 
    const sdnn = Math.sqrt(variance); 
    return Math.round(sdnn); // sdnn = hrv 
}

// Calculate rmssd 
function cal_rmssd(rrIntervals) { 
    const differences = []
    for (let i = 1; i < rrIntervals.length; i++) {
        const diff = rrIntervals[i] - rrIntervals[i - 1]; 
        differences.push(diff)
    }

    const squareDiff = differences.map(diff => diff * diff);

    let total = 0; 
    for (let i = 0; i < squareDiff.length; i++) { 
        total += squareDiff[i];
    }

    const meanSquareDiff = total / squareDiff.length;
    // Cal rmssd
    const rmssd = Math.sqrt(meanSquareDiff); 
    return Math.round(rmssd);
}

// Storing heart rates
function store_heart_rates(heart_rate) {
    heartRates.push(heart_rate);

    if (heartRates.length > 14) {
        heartRates.shift();
    }
    console.log(`Heart Rates added ${heartRates}`);
}


// Calculate Stress index
async function calculate_stress_index(prev_hrs, real_time_hr, heart_points) {
    let baseline = calculate_baseline_heartRate(prev_hrs);
    // console.log(`Baseline cal: ${baseline}`);

    // heartRates.push(average_hr);
    // if ( heartRates.length > 14 ) { 
    //     heartRates.shift();
    // }
    // console.log(`Heart rates after adding: ${heartRates}`)

    const rr = cal_RRintervals(prev_hrs);
    console.log(`RR Intervals: ${rr}`);

    const hrv = calculate_hrv(rr);
    console.log(`Calculated HRV: ${hrv}`);

    const rmssd = cal_rmssd(rr);
    console.log(`Calculated RMSSD: ${rmssd}`);


    let stressIndex = ((real_time_hr / baseline) * (hrv / rmssd ) * (1 - heart_points/100))
    let roundedSI = Number(stressIndex.toFixed(2));
    console.log(`Stress Index: ${roundedSI}`);
    let cal_stress = roundedSI * 100
    // console.log(`Stress: ${stress}`); Debug

    if (cal_stress >= baseline + STRESS_THRESHOLD) { 
        notify(userId, roundedSI, baseline);
    }
    store_stress_index(roundedSI);
    return roundedSI, determine_stress_level(roundedSI);
}

// Calculate baseline 
function calculate_baseline_heartRate(heartRates) { 
    if (heartRates.length === 0) 
        return 0;
    let totalStress = 0;
    for (let i = 0; i < heartRates.length; i++) { 
        totalStress += heartRates[i];
    }

    return Math.round(totalStress / heartRates.length);
}

// Notify 
function notify(userId, stressIndex, baseline) {
    console.log(`User ${userId} notified: Stress index ${stressIndex} exceeds baseline ${baseline}.`);
}

// Store stress index store => useful for later
function store_stress_index(stress_index) {
    stressArray.push(stress_index);
    if (stressArray.length > 14) {
        stressArray.shift();
    }
    // console.log(`Stress: ${stress_index} stored in array ${stressArray} for weekly reports/metrics.`);
}

/*
 * Determine if index is low, moderate or high
 * LOW => 0 <-> 0.7
 * MOD => 0.7 <-> 0.9
 * HIGH => 0.9 & ABOVE
 */
function determine_stress_level (stressIndex) { 
    let level;
    if (stressIndex < STRESS_LEVELS.LOW.range[1]) { 
        level = STRESS_LEVELS.LOW.label;
    } else if (stressIndex < STRESS_LEVELS.MODERATE.range[1]) { 
        level = STRESS_LEVELS.MODERATE.label;
    } else { 
        level = STRESS_LEVELS.HIGH.label;
    }
    // console.log(`Stress Level: ${level}`);
    return level;
}

module.exports = {
    cal_RRintervals,
    calculate_hrv,
    cal_rmssd,
    calculate_stress_index,
    calculate_baseline_heartRate, 
    store_heart_rates,
    determine_stress_level, 
    store_stress_index,
    STRESS_THRESHOLD
};
