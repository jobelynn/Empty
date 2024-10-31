package com.abjjrs.stressapp.ui.googlefitauth

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.abjjrs.stressapp.MainActivity
import com.abjjrs.stressapp.R
import com.abjjrs.stressapp.R.*
import com.abjjrs.stressapp.SessionData
import com.abjjrs.stressapp.network.performAuthRequest
import com.abjjrs.stressapp.network.performGetAccessToken
import kotlinx.coroutines.*

class GoogleFitAuthActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.google_fit_auth)

        println("ONCREATE IN GOOGLEFITAUTHACTIVITY")

        // Check if this intent is from the custom URI scheme
        handleDeepLinkIntent(intent)

        // Get references to UI elements
        val buttonSyncNow: Button = findViewById(R.id.buttonSyncNow)

        // Set up sync now button click listener
        buttonSyncNow.setOnClickListener {
            val userId = SessionData.userId
            if (userId != null) {
                println("UserId: $userId")
                CoroutineScope(Dispatchers.Main).launch {
                    println("Performing auth request")
                    performAuthRequest(this@GoogleFitAuthActivity, userId)
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        println("NEW INTENT IN GOOGLEFITAUTHACTIVITY")
        // Handle the deep link intent if a new intent arrives
        handleDeepLinkIntent(intent)
    }

    private fun handleDeepLinkIntent(intent: Intent?) {
        val data: Uri? = intent?.data
        data?.let {
            if (it.scheme == "stressapp" && it.host == "oauth2callback") {
                println("Deep link received: ${it.toString()}")
                val nextIntent = Intent(this, MainActivity::class.java)
                startActivity(nextIntent)
            }
        }
    }
}