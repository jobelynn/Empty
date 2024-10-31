package com.abjjrs.stressapp.network

import android.content.Context
import com.abjjrs.stressapp.SessionData
import com.abjjrs.stressapp.models.AccessTokenDataModel
import com.abjjrs.stressapp.models.AllStressDataModel
import com.abjjrs.stressapp.models.StressIndexDataModel
import com.abjjrs.stressapp.models.UserDataModel
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface FirestoreApiService {

    @GET("api/firestore/get/stress-data/realtime")
    fun getRealtimeStress(@Query("userId") userId: String, @Query("accessToken") accessToken: String): Call<StressIndexDataModel>

    @POST("api/firestore/add/user")
    fun addUser(@Body user: UserDataModel): Call<Void>

    @GET("api/firestore/get/stress-data/all")
    fun getAllStress(@Query("userId") userId: String): Call<AllStressDataModel>

}

suspend fun performGetRealtimeStress(userId: String, accessToken: String, callback: (Number?) -> Unit) {
    RetrofitClient.firestoreApiService.getRealtimeStress(userId, accessToken).enqueue(object : retrofit2.Callback<StressIndexDataModel> {
        override fun onResponse(call: Call<StressIndexDataModel>, response: retrofit2.Response<StressIndexDataModel>) {
            println("RUNNING onResponse")
            if (response.isSuccessful) {
                val currentStressIndex = response.body()?.currentStressIndex
                callback(currentStressIndex)
            } else {
                println("Request failed with code: ${response.code()}")
                callback(null)
            }
        }

        override fun onFailure(call: Call<StressIndexDataModel>, t: Throwable) {
            println("FAILURE")
            t.printStackTrace()
            callback(null)
        }
    })
}

suspend fun addUser(user: UserDataModel) {
    RetrofitClient.firestoreApiService.addUser(user).enqueue(object : retrofit2.Callback<Void> {
        override fun onResponse(call: Call<Void>, response: retrofit2.Response<Void>) {
            if (response.isSuccessful) {
                println("User added successfully")
            } else {
                println("Failed to add user: ${response.code()}")
            }
        }

        override fun onFailure(call: Call<Void>, t: Throwable) {
            println("Request failed: ${t.message}")
        }
    })
}

suspend fun performGetAllStress(userId: String, callback: (String?) -> Unit) {
    RetrofitClient.firestoreApiService.getAllStress(userId).enqueue(object : retrofit2.Callback<AllStressDataModel> {
        override fun onResponse(call: Call<AllStressDataModel>, response: retrofit2.Response<AllStressDataModel>) {
            println("RUNNING onResponse")
            if (response.isSuccessful) {
                val stressData = response.body()?.stressData
                callback(stressData)
            } else {
                println("Request failed with code: ${response.code()}")
                callback(null)
            }
        }

        override fun onFailure(call: Call<AllStressDataModel>, t: Throwable) {
            println("FAILURE")
            t.printStackTrace()
            callback(null)
        }
    })
}