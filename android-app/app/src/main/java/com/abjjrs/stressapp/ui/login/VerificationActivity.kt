package com.abjjrs.stressapp.ui.login

import android.content.Intent
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.abjjrs.stressapp.R
import com.abjjrs.stressapp.ui.login.LoginActivity

class VerificationActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_verification)

        val textViewBackToLogin: TextView = findViewById(R.id.textViewBackToLogin)

        // Set click listener for "Back to Login"
        textViewBackToLogin.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish() // Optional: finish this activity so the user can't navigate back
        }
    }
}