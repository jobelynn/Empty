# Documentation for capstone-project-2024-t3-3900f13aabjjrs

**Sprint 1**

*File Structure*
/ (Root Directory) 

├── README.md (Project Overview)

├── documentation.md (Documentation for team and client)

├── android-app/ (App directory)

├── config/ (Config and below is database-related files)

├── package-lock.json 

├── package.json 

└── src/

***Back-end***

Please ensure you ```npm install firebase``` if you are working with Firebase.
<br /><br />

***Front-end***

*File Structure*
/ (android-app) 

├── .gradle/ (Don't need to touch this folder. Managed by Gradle.)

├── .idea/ (Don't need to modify manually. Android Studio internally manages.)

├── app/ (**Core directory**. Code, resources + UI layouts here.)

├── gradle/ (Gradle wrapper -> allows building without others installing Gradle)

├── .gitignore

├── build.gradle.kts (Build script written in Kotlin DSL. Project configs for Gradle)

├── gradlew and gradlew.bat (Gradle commands wrapper for Mac and Windows)

├── local.properties (Normally git ignored, local configs)

└── settings.gradle.kts (Structures Gradle project and whether it has multiple modules)

Android App written in Kotlin DSL.
To change the front-end, go to android-app/app. You will be working with individual .xml files to define the appearance of the app.

If you are working on front end you will mainly be on:
- ```/app/src/main/java/com/abjjrs/stressapp```: Where you write your Kotlin code (.kt files)
- ```/app/src/main/res/layout``` : Where you edit XML layout files.
- ```/app/src/main/res/```: Where your resources like layouts, images, and strings are stored.
- ```build.gradle.kts```: Where you configure dependencies and build settings.
- ```settings.gradle.kts```: Defines the module structure of your project.

<br /><br />

*Backlog*\
<br />
03/10 - 04/10
Setting up of Firebase database. Project set up on Firebase and all members added.

05/10
Switch has been decided to Android mobile app development rather than Apple. Google Fit API to be used.

06/10
Android App template set up. App development in Android Studio.

10/10
Server running and attempting to get Google Fit API working. 
Attempt made with authentication, no testing done.
Beginning attempts at front-end.
