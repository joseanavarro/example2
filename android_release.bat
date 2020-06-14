@echo off

if not exist "releases" mkdir releases

call gulp

call cordova build android --release

call jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore vtep360-release-keystore.keystore platforms\android\build\outputs\apk\android-armv7-release-unsigned.apk vtep360 -storepass 1hk16cf6 -keypass 1hk16cf6

call jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore vtep360-release-keystore.keystore platforms\android\build\outputs\apk\android-x86-release-unsigned.apk vtep360 -storepass 1hk16cf6 -keypass 1hk16cf6

del releases\walk2view.crosswalk.arm.apk

del releases\walk2view.crosswalk.x86.apk

call zipalign -v 4 platforms\android\build\outputs\apk\android-armv7-release-unsigned.apk releases\walk2view.crosswalk.arm.apk

call zipalign -v 4 platforms\android\build\outputs\apk\android-x86-release-unsigned.apk releases\walk2view.crosswalk.x86.apk


pause