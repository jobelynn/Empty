package com.abjjrs.stressapp.ui.weeklyreport

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel


class WeeklyReportViewModel : ViewModel() {
    // MutableLiveData to hold your data
    private val _stressData = MutableLiveData<List<Float>>() // Using float for now
    val stressData: LiveData<List<Float>> get() = _stressData

    private val hrv = MutableLiveData<List<Float>>() // Sample HRV data
    val hrvData: LiveData<List<Float>> get() = hrv

    private val heartRate = MutableLiveData<List<Float>>() // Sample heart rate data
    val heartRateData: LiveData<List<Float>> get() = heartRate

    private val averageLevel = MutableLiveData<Float>()
    val averageStressLevel: LiveData<Float> get() = averageLevel


    // Method to load data on graph
    fun loadStressData() {
        // Will need to stimulate this with fetches from actual algorithm
        _stressData.value = listOf(1.0f, 0.5f, 0.5f, 0.6f, 0.6f, 0.7f, 0.5f) // Sample data
        // average level not done yet
        val sampleHRV = listOf(50.0f, 55.0f, 48.0f, 53.0f, 60.0f, 55.0f, 52.0f)
        hrv.value = sampleHRV
        // hr sample cal
        val sampleHeartRate = listOf(70f, 60f, 80f, 70f, 70f, 70f, 50f)
        heartRate.value = sampleHeartRate


    }

    private fun calAverage(data: List<Float>): Float {
        return data.average().toFloat()
    }

    fun initializeData() {
        loadStressData()

    }
}