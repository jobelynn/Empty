// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        mavenCentral()
        maven { url = uri("https://jitpack.io") } // Keep this line for Jitpack
    }
    dependencies {
        // Add the Firebase Google services plugin
        classpath("com.google.gms:google-services:4.3.15") // Ensure there are no duplicates
    }
}

plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}