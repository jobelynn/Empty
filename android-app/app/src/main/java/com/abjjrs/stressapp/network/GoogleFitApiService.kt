package com.abjjrs.stressapp.network

import android.content.Context
import android.net.Uri
import androidx.browser.customtabs.CustomTabsIntent
import com.abjjrs.stressapp.SessionData
import com.abjjrs.stressapp.models.AuthURLDataModel
import com.abjjrs.stressapp.models.AccessTokenDataModel
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Query

interface GoogleFitApiService {

    @GET("api/google-fit/auth/google")
    fun getAuthURL(@Query("userId") userId: String): Call<AuthURLDataModel>

    @GET("api/google-fit/get-access-token")
    fun getAccessToken(@Query("userId") userId: String): Call<AccessTokenDataModel>

}

suspend fun performAuthRequest(context: Context, userId: String) {
    RetrofitClient.googleFitApiService.getAuthURL(userId).enqueue(object : retrofit2.Callback<AuthURLDataModel> {
        override fun onResponse(call: Call<AuthURLDataModel>, response: retrofit2.Response<AuthURLDataModel>) {
            println("RUNNING onResponse")
            if (response.isSuccessful) {
                val data = response.body()
                val authUrl = data?.authUrl

                if (!authUrl.isNullOrEmpty()) {
                    // Open the URL using Chrome Custom Tabs
                    val builder = CustomTabsIntent.Builder()
                    val customTabsIntent = builder.build()

                    // Use the passed context to launch the URL
                    customTabsIntent.launchUrl(context, Uri.parse(authUrl))
                } else {
                    println("Auth URL is null or empty")
                }
            } else {
                println("Request failed with code: ${response.code()}")
            }
        }

        override fun onFailure(call: Call<AuthURLDataModel>, t: Throwable) {
            println("FAILURE")
            t.printStackTrace()
        }
    })
}

suspend fun performGetAccessToken(context: Context, userId: String) {
    RetrofitClient.googleFitApiService.getAccessToken(userId).enqueue(object : retrofit2.Callback<AccessTokenDataModel> {
        override fun onResponse(call: Call<AccessTokenDataModel>, response: retrofit2.Response<AccessTokenDataModel>) {
            println("RUNNING onResponse")
            if (response.isSuccessful) {
                val data = response.body()
                val accessToken = data?.accessToken

                if (!accessToken.isNullOrEmpty()) {
                    // Store accessToken in SessionData
                    SessionData.accessToken = accessToken
                    println("Access token saved successfully.")
                } else {
                    println("accessToken is null or empty")
                }
            } else {
                println("Request failed with code: ${response.code()}")
            }
        }

        override fun onFailure(call: Call<AccessTokenDataModel>, t: Throwable) {
            println("FAILURE")
            t.printStackTrace()
        }
    })
}