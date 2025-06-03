# ResusMGR Android Project Structure

## Root Files

### settings.gradle
```gradle
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "ResusMGR"
include ':app'
```

### build.gradle (Root)
```gradle
plugins {
    id 'com.android.application' version '8.0.0' apply false
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}
```

### gradlew
```bash
#!/bin/sh
APP_HOME=$(dirname "$0")
CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar
exec java -Xmx512m -Xms64m -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
```

### gradle/wrapper/gradle-wrapper.properties
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.0-bin.zip
```

## App Module

### app/build.gradle
```gradle
plugins {
    id 'com.android.application'
}

android {
    namespace 'com.ashleyjamesmedical.resusmgr'
    compileSdk 33

    defaultConfig {
        applicationId 'com.ashleyjamesmedical.resusmgr'
        minSdk 21
        targetSdk 33
        versionCode 1
        versionName '1.0.0'
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
    implementation 'com.google.android.material:material:1.8.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0'
}
```

### app/proguard-rules.pro
```proguard
# Keep WebView related classes
-keep class android.webkit.** { *; }
-keep class androidx.swiperefreshlayout.widget.** { *; }
```

## Source Code

### app/src/main/AndroidManifest.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
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
        android:usesCleartextTraffic="true"
        tools:targetApi="31">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.ResusMGR">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### app/src/main/java/com/ashleyjamesmedical/resusmgr/MainActivity.java
```java
package com.ashleyjamesmedical.resusmgr;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private SwipeRefreshLayout swipeRefreshLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        webView = findViewById(R.id.webView);

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);

        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("https://www.resusmgr.co.uk");

        swipeRefreshLayout.setOnRefreshListener(() -> {
            webView.reload();
            swipeRefreshLayout.setRefreshing(false);
        });
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

## Resources

### app/src/main/res/layout/activity_main.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.swiperefreshlayout.widget.SwipeRefreshLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/swipeRefreshLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</androidx.swiperefreshlayout.widget.SwipeRefreshLayout>
```

### app/src/main/res/values/strings.xml
```xml
<resources>
    <string name="app_name">ResusMGR</string>
</resources>
```

### app/src/main/res/values/themes.xml
```xml
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.ResusMGR" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
        <item name="colorPrimary">@color/purple_500</item>
        <item name="colorPrimaryVariant">@color/purple_700</item>
        <item name="colorOnPrimary">@color/white</item>
        <item name="colorSecondary">@color/teal_200</item>
        <item name="colorSecondaryVariant">@color/teal_700</item>
        <item name="colorOnSecondary">@color/black</item>
        <item name="android:statusBarColor" tools:targetApi="l">?attr/colorPrimaryVariant</item>
    </style>
</resources>
```

### app/src/main/res/values/colors.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
</resources>
```

### app/src/main/res/xml/backup_rules.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<full-backup-content />
```

### app/src/main/res/xml/data_extraction_rules.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <include domain="auto" />
    </cloud-backup>
    <device-transfer>
        <include domain="auto" />
    </device-transfer>
</data-extraction-rules>
```

## Directory Structure
```
ResusMGR/
├── app/
│   ├── build.gradle
│   ├── proguard-rules.pro
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/
│           │   └── com/
│           │       └── ashleyjamesmedical/
│           │           └── resusmgr/
│           │               └── MainActivity.java
│           └── res/
│               ├── layout/
│               │   └── activity_main.xml
│               ├── mipmap-hdpi/
│               │   ├── ic_launcher.png
│               │   └── ic_launcher_round.png
│               ├── mipmap-mdpi/
│               │   ├── ic_launcher.png
│               │   └── ic_launcher_round.png
│               ├── mipmap-xhdpi/
│               │   ├── ic_launcher.png
│               │   └── ic_launcher_round.png
│               ├── mipmap-xxhdpi/
│               │   ├── ic_launcher.png
│               │   └── ic_launcher_round.png
│               ├── mipmap-xxxhdpi/
│               │   ├── ic_launcher.png
│               │   └── ic_launcher_round.png
│               ├── values/
│               │   ├── colors.xml
│               │   ├── strings.xml
│               │   └── themes.xml
│               └── xml/
│                   ├── backup_rules.xml
│                   └── data_extraction_rules.xml
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── build.gradle
├── gradlew
├── gradlew.bat
└── settings.gradle
```

## App Configuration
- **Package Name**: com.ashleyjamesmedical.resusmgr
- **App Name**: ResusMGR
- **Version**: 1.0.0
- **Target SDK**: Android 13 (API 33)
- **Minimum SDK**: Android 5.0 (API 21)
- **URL**: https://www.resusmgr.co.uk

## Features
- WebView with JavaScript enabled
- Swipe-to-refresh functionality
- Back button navigation
- Internet and network state permissions
- Material Design theme
- Professional app branding