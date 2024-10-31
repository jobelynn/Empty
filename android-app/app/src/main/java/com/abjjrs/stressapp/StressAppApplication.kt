package com.abjjrs.stressapp

import android.app.Application
import com.google.firebase.ktx.Firebase
import com.google.firebase.ktx.initialize

class StressAppApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize Firebase globally
        Firebase.initialize(this)
    }
}