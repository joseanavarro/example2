var fs = require('fs')
fs.readFile('platforms/android/AndroidManifest.xml', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/android:maxSdkVersion="19"/g, '');

  fs.writeFile('platforms/android/AndroidManifest.xml', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});