/**
 * Custom Domain APK Build Script for ResusMGR
 * Creates an APK that loads https://www.resusmgr.co.uk/home directly
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🚀 Building ResusMGR Custom Domain Android APK...\n');

// Configuration for custom domain
const config = {
  appName: 'ResusMGR',
  packageName: 'com.ashleyjamesmedical.resusmgr',
  versionCode: 2,
  versionName: '1.1.0',
  minSdk: 24,
  targetSdk: 34,
  compileSdk: 34,
  serverUrl: 'https://www.resusmgr.co.uk/home',
  domain: 'www.resusmgr.co.uk'
};

// Create android directory structure
const androidDir = 'android-custom-domain';
const appDir = `${androidDir}/app`;
const srcDir = `${appDir}/src/main`;
const resDir = `${srcDir}/res`;

// Clean and create directories
if (fs.existsSync(androidDir)) {
  fs.rmSync(androidDir, { recursive: true, force: true });
}

const dirs = [
  androidDir,
  appDir,
  srcDir,
  `${resDir}/values`,
  `${resDir}/drawable`,
  `${resDir}/mipmap-mdpi`,
  `${resDir}/mipmap-hdpi`,
  `${resDir}/mipmap-xhdpi`,
  `${resDir}/mipmap-xxhdpi`,
  `${resDir}/mipmap-xxxhdpi`,
  `${resDir}/xml`,
  `${srcDir}/java/com/ashleyjamesmedical/resusmgr`
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function createFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim());
  console.log(`✅ Created: ${filePath}`);
}

// Root build.gradle
const rootBuildGradle = `
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.1.1'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`;

// App build.gradle
const appBuildGradle = `
plugins {
    id 'com.android.application'
}

android {
    compileSdk ${config.compileSdk}
    namespace "${config.packageName}"
    
    defaultConfig {
        applicationId "${config.packageName}"
        minSdk ${config.minSdk}
        targetSdk ${config.targetSdk}
        versionCode ${config.versionCode}
        versionName "${config.versionName}"
        
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.9.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.browser:browser:1.6.0'
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
    
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}
`;

// AndroidManifest.xml with custom domain configuration
const androidManifest = `
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ResusMGR"
        tools:targetApi="31">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.ResusMGR.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Digital Asset Links for custom domain verification -->
        <meta-data 
            android:name="asset_statements" 
            android:value="@string/asset_statements" />

    </application>
</manifest>
`;

// MainActivity.java - WebView that loads custom domain
const mainActivity = `
package com.ashleyjamesmedical.resusmgr;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.view.View;
import android.webkit.PermissionRequest;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private static final String APP_URL = "${config.serverUrl}";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        
        // Configure WebView settings
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setAppCacheEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(false);
        webSettings.setDefaultTextEncodingName("utf-8");

        // Set WebView client
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Keep navigation within the app for ResusMGR domain
                if (url.contains("resusmgr.co.uk")) {
                    view.loadUrl(url);
                    return true;
                }
                return super.shouldOverrideUrlLoading(view, url);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Hide loading indicator if you have one
            }
        });

        // Set WebChrome client for better web app support
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                // Grant permissions for PWA features
                request.grant(request.getResources());
            }
        });

        // Load the ResusMGR app
        webView.loadUrl(APP_URL);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        webView.destroy();
    }
}
`;

// activity_main.xml layout
const activityMainLayout = `
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res/auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_centerInParent="true" />

</RelativeLayout>
`;

// strings.xml with asset statements for domain verification
const stringsXml = `
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">ResusMGR</string>
    <string name="asset_statements">
        [{
            "relation": ["delegate_permission/common.handle_all_urls"],
            "target": {
                "namespace": "web",
                "site": "https://${config.domain}"
            }
        }]
    </string>
</resources>
`;

// colors.xml
const colorsXml = `
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#2563EB</color>
    <color name="colorPrimaryDark">#1D4ED8</color>
    <color name="colorAccent">#7C3AED</color>
    <color name="white">#FFFFFF</color>
    <color name="black">#000000</color>
</resources>
`;

// themes.xml
const themesXml = `
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.ResusMGR" parent="Theme.Material3.DayNight">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
    </style>
    
    <style name="Theme.ResusMGR.NoActionBar">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
        <item name="android:statusBarColor">@color/colorPrimary</item>
    </style>
</resources>
`;

// data_extraction_rules.xml
const dataExtractionRules = `
<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <include domain="sharedpref" path="."/>
        <exclude domain="sharedpref" path="device.xml"/>
    </cloud-backup>
    <device-transfer>
        <include domain="sharedpref" path="."/>
        <exclude domain="sharedpref" path="device.xml"/>
    </device-transfer>
</data-extraction-rules>
`;

// backup_rules.xml
const backupRules = `
<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <exclude domain="sharedpref" path="device_prefs.xml"/>
</full-backup-content>
`;

// gradle.properties
const gradleProperties = `
android.useAndroidX=true
android.enableJetifier=true
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.nonTransitiveRClass=true
android.nonFinalResIds=false
`;

// settings.gradle
const settingsGradle = `
include ':app'
rootProject.name = "ResusMGR"
`;

// Create all files
console.log('📁 Creating Android project structure...');

createFile(`${androidDir}/build.gradle`, rootBuildGradle);
createFile(`${androidDir}/settings.gradle`, settingsGradle);
createFile(`${androidDir}/gradle.properties`, gradleProperties);

createFile(`${appDir}/build.gradle`, appBuildGradle);
createFile(`${srcDir}/AndroidManifest.xml`, androidManifest);

createFile(`${srcDir}/java/com/ashleyjamesmedical/resusmgr/MainActivity.java`, mainActivity);

createFile(`${resDir}/layout/activity_main.xml`, activityMainLayout);
createFile(`${resDir}/values/strings.xml`, stringsXml);
createFile(`${resDir}/values/colors.xml`, colorsXml);
createFile(`${resDir}/values/themes.xml`, themesXml);

createFile(`${resDir}/xml/data_extraction_rules.xml`, dataExtractionRules);
createFile(`${resDir}/xml/backup_rules.xml`, backupRules);

// ResusMGR official icon with medical gradient and heart design
const iconSvg = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="medicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563EB;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="24" cy="24" r="24" fill="url(#medicalGradient)"/>
  <path d="M24 36L21.6 33.9C17.4 30.2 14.4 27.6 14.4 24.3C14.4 21.6 16.4 19.6 19.2 19.6C20.8 19.6 22.4 20.4 24 21.6C25.6 20.4 27.2 19.6 28.8 19.6C31.6 19.6 33.6 21.6 33.6 24.3C33.6 27.6 30.6 30.2 26.4 33.9L24 36Z" fill="white"/>
</svg>
`;

createFile(`${resDir}/drawable/ic_launcher_foreground.xml`, `
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
  
  <!-- Medical gradient background circle -->
  <group android:pivotX="54" android:pivotY="54">
    <path android:fillColor="#2563EB"
        android:pathData="M54,54m-45,0a45,45 0,1 1,90 0a45,45 0,1 1,-90 0"/>
    <path android:fillColor="#7C3AED"
        android:pathData="M54,54m-35,0a35,35 0,1 1,70 0a35,35 0,1 1,-70 0"/>
    <path android:fillColor="#DC2626"
        android:pathData="M54,54m-25,0a25,25 0,1 1,50 0a25,25 0,1 1,-50 0"/>
  </group>
  
  <!-- White heart icon -->
  <path android:fillColor="#FFFFFF"
      android:pathData="M54,72L48.6,67.1C39.15,58.55 32.4,52.65 32.4,45.225C32.4,39.6 36.9,35.1 42.525,35.1C46.575,35.1 50.625,37.125 54,40.05C57.375,37.125 61.425,35.1 65.475,35.1C71.1,35.1 75.6,39.6 75.6,45.225C75.6,52.65 68.85,58.55 59.4,67.1L54,72Z"/>
</vector>
`);

// Create mipmap icons (simplified - in production you'd want proper icons)
const iconXml = `
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/colorPrimary"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
`;

['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'].forEach(density => {
  createFile(`${resDir}/mipmap-${density}/ic_launcher.xml`, iconXml);
  createFile(`${resDir}/mipmap-${density}/ic_launcher_round.xml`, iconXml);
});

// Create build instructions
const buildInstructions = `
# ResusMGR Custom Domain APK Build Instructions

## Prerequisites
1. Install Android Studio or Android Command Line Tools
2. Install Java 8 or higher
3. Set ANDROID_HOME environment variable

## Build Steps

### Option 1: Using Android Studio
1. Open Android Studio
2. Open the '${androidDir}' folder as a project
3. Wait for Gradle sync to complete
4. Go to Build > Generate Signed Bundle/APK
5. Choose APK and follow the signing wizard

### Option 2: Using Command Line
1. Navigate to the ${androidDir} directory:
   cd ${androidDir}

2. Make gradlew executable (Linux/Mac):
   chmod +x gradlew

3. Build debug APK:
   ./gradlew assembleDebug

4. Build release APK (requires signing):
   ./gradlew assembleRelease

## Output Location
- Debug APK: ${androidDir}/app/build/outputs/apk/debug/app-debug.apk
- Release APK: ${androidDir}/app/build/outputs/apk/release/app-release.apk

## App Configuration
- App loads: ${config.serverUrl}
- Package name: ${config.packageName}
- Version: ${config.versionName} (${config.versionCode})
- Target SDK: ${config.targetSdk}
- Min SDK: ${config.minSdk}

## Testing
1. Install the APK on an Android device
2. The app should automatically load ${config.serverUrl}
3. Verify all ResusMGR features work correctly
4. Test offline functionality and app resume behavior

## Publishing
Before publishing to Google Play Store:
1. Create a release build with proper signing
2. Test thoroughly on multiple devices
3. Ensure all Google Play Store requirements are met
4. Update version numbers for each release
`;

createFile(`${androidDir}/BUILD_INSTRUCTIONS.md`, buildInstructions);

console.log('\n🎉 Custom Domain APK project created successfully!');
console.log(`📱 App will load: ${config.serverUrl}`);
console.log(`📁 Project location: ${androidDir}/`);
console.log(`📖 Build instructions: ${androidDir}/BUILD_INSTRUCTIONS.md`);
console.log('\n⚡ Ready to build APK that connects directly to your custom domain!');