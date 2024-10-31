package com.abjjrs.stressapp.ui.login

import android.util.Log
import android.content.Intent
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import android.widget.Toast
import com.google.android.material.snackbar.Snackbar
import androidx.appcompat.app.AppCompatActivity
import com.abjjrs.stressapp.R
import com.abjjrs.stressapp.models.UserDataModel
import com.abjjrs.stressapp.network.addUser
import com.abjjrs.stressapp.network.performAuthRequest
import com.abjjrs.stressapp.ui.login.VerificationActivity
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class CreateAccountActivity : AppCompatActivity() {

    // Firebase Auth instance
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_account)

        // Initialize Firebase Auth
        auth = FirebaseAuth.getInstance()

        val editTextName: EditText = findViewById(R.id.editTextName)
        val editTextEmail: EditText = findViewById(R.id.editTextEmail)
        val editTextPassword: EditText = findViewById(R.id.editTextPassword)
        val editTextDOB: EditText = findViewById(R.id.editTextDOB)
        val spinnerGender: Spinner = findViewById(R.id.spinnerGender)
        val buttonCreateAccount: Button = findViewById(R.id.buttonCreateAccount)

        // Set up spinner for gender selection
        val genders = arrayOf("Select Gender", "Male", "Female", "Other")
        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, genders)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        spinnerGender.adapter = adapter

        buttonCreateAccount.setOnClickListener {
            val email = editTextEmail.text.toString().trim()
            val password = editTextPassword.text.toString().trim()

            if (email.isEmpty()) {
                Toast.makeText(this, "Please enter an email", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (password.isEmpty()) {
                Toast.makeText(this, "Please enter a password", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Call function to create the user account
            createAccount(email, password)
        }
    }

    private fun createAccount(email: String, password: String) {
        auth.createUserWithEmailAndPassword(email, password)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    // Account creation success
                    val user = auth.currentUser // Get the current user
                    val userId: String = user?.uid ?: "ERROR - NULL USERID"
                    val userDataModel = UserDataModel(userId = userId, email = email, password = password)
                    println("ADDING USER")
                    CoroutineScope(Dispatchers.Main).launch {
                        addUser(userDataModel)
                    }
                    sendEmailVerification(user) // Send the email verification

                    // Redirect to VerificationActivity
                    val intent = Intent(this, VerificationActivity::class.java)
                    startActivity(intent)
                    finish() // Optional: finish this activity so the user can't navigate back
                } else {
                    // If account creation fails, display a message to the user
                    Snackbar.make(findViewById(android.R.id.content), "Account Creation Failed: ${task.exception?.message}", Snackbar.LENGTH_LONG).show()
                }
            }
    }

    private fun sendEmailVerification(user: FirebaseUser?) {
        user?.sendEmailVerification()
            ?.addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    Toast.makeText(baseContext, "Verification email sent to ${user.email}", Toast.LENGTH_SHORT).show()
                } else {
                    Log.e("CreateAccountActivity", "sendEmailVerification failed.", task.exception)
                    Toast.makeText(baseContext, "Failed to send verification email.", Toast.LENGTH_SHORT).show()
                }
            }
    }
}