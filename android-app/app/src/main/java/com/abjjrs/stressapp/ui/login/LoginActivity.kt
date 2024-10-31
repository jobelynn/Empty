package com.abjjrs.stressapp.ui.login

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.abjjrs.stressapp.R
import com.google.firebase.auth.FirebaseAuth
import androidx.browser.customtabs.CustomTabsIntent
import android.net.Uri
import com.abjjrs.stressapp.MainActivity
import com.abjjrs.stressapp.models.AuthURLDataModel
import com.abjjrs.stressapp.network.RetrofitClient
import retrofit2.Call
import android.content.Context
import com.abjjrs.stressapp.SessionData
import com.abjjrs.stressapp.network.performAuthRequest
import com.abjjrs.stressapp.ui.googlefitauth.GoogleFitAuthActivity

class LoginActivity : AppCompatActivity() {

    // Firebase Auth instance
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.login_activity)

        // Initialize Firebase Auth
        auth = FirebaseAuth.getInstance()

        // Get references to UI elements
        val editTextEmail: EditText = findViewById(R.id.editTextEmail)
        val editTextPassword: EditText = findViewById(R.id.editTextPassword)
        val buttonLogin: Button = findViewById(R.id.buttonLogin)
        val textViewCreateAccount: TextView = findViewById(R.id.textViewCreateAccount)
        val textViewForgotPassword: TextView = findViewById(R.id.textViewForgotPassword)

        // Set up login button click listener
        buttonLogin.setOnClickListener {
            val email = editTextEmail.text.toString().trim()
            val password = editTextPassword.text.toString().trim()

            // Validate inputs before proceeding
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill in both fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Call function to authenticate user
            signInWithEmailPassword(email, password)


            // Redirect to GoogleFitAuthActivity after successful login
            val intent = Intent(this, GoogleFitAuthActivity::class.java)
            startActivity(intent)
            finish()  // Optionally finish LoginActivity if you don't want to return to it
        }

        textViewCreateAccount.setOnClickListener {
            // Redirect to CreateAccountActivity
            val intent = Intent(this, CreateAccountActivity::class.java)
            startActivity(intent)
        }

        // Set up forgot password text view click listener (optional)
        textViewForgotPassword.setOnClickListener {
            val intent = Intent(this, ForgotPasswordActivity::class.java)
            startActivity(intent)
        }
    }

    private fun signInWithEmailPassword(email: String, password: String) {
        // Sign in with email and password
        auth.signInWithEmailAndPassword(email, password)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    // Sign-in success, retrieve the UID
                    val user = auth.currentUser
                    val uid = user?.uid

                    // Store UID in SessionData
                    SessionData.userId = uid

                    // Navigate to MainActivity
                    // val intent = Intent(this, MainActivity::class.java)
                    // startActivity(intent)
                    // finish()  // Finish the LoginActivity so the user can't go back to it
                } else {
                    // If sign in fails, display a message to the user
                    Toast.makeText(this, "Authentication Failed: ${task.exception?.message}", Toast.LENGTH_SHORT).show()
                }
            }
    }
}