sudo mkdir -p releases
sudo gulp
sudo cordova build android --release
sudo jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore vtep360-release-keystore.keystore platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk vtep360 -storepass 1hk16cf6 -keypass 1hk16cf6
sudo jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore vtep360-release-keystore.keystore platforms/android/build/outputs/apk/android-x86-release-unsigned.apk vtep360 -storepass 1hk16cf6 -keypass 1hk16cf6
sudo rm releases/walk2view.crosswalk.arm.apk
sudo rm releases/walk2view.crosswalk.x86.apk
sudo /usr/local/Cellar/android-sdk/24.4.1_1/build-tools/25.0.1/zipalign -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk releases/walk2view.crosswalk.arm.apk
sudo /usr/local/Cellar/android-sdk/24.4.1_1/build-tools/25.0.1/zipalign -v 4 platforms/android/build/outputs/apk/android-x86-release-unsigned.apk releases/walk2view.crosswalk.x86.apk
