package com.abjjrs.stressapp.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    private const val BASE_URL = "https://stressapp-abjjrs.onrender.com/" // Server URL

    // Lazy initialization of the Retrofit instance
    private val retrofit: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    // Lazy initialization for the GoogleFitApiService
    val googleFitApiService: GoogleFitApiService by lazy {
        retrofit.create(GoogleFitApiService::class.java)
    }

    // Lazy initialization for the AuthApiService
    val authApiService: AuthApiService by lazy {
        retrofit.create(AuthApiService::class.java)
    }

    // Lazy initialization for the FirestoreApiService
    val firestoreApiService: FirestoreApiService by lazy {
        retrofit.create(FirestoreApiService::class.java)
    }
}