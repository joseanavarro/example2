#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var UglifyJS = require('uglify-js');
var ngAnnotate = require('ng-annotate');
var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platform = process.env.CORDOVA_PLATFORMS;
var cliCommand = process.env.CORDOVA_CMDLINE;

// hook configuration
var isRelease = true; // by default this hook is always enabled, see the line below on how to execute it only for release
var isRelease = (cliCommand.indexOf('--release') > -1);
var recursiveFolderSearch = true; // set this to false to manually indicate the folders to process
var foldersToProcess = [ // add other www folders in here if needed (ex. js/controllers)
    'dist_js'
];

if (!isRelease) {
    return;
}

console.log('cordova-uglify will always run by default, uncomment the line checking for the release flag otherwise');

switch (platform) {
    case 'android':
        platformPath = path.join(platformPath, platform, 'assets', 'www');
        break;
    case 'ios':
        platformPath = path.join(platformPath, platform, 'www');
        break;
    default:
        console.log('this hook only supports android and ios currently');
        return;
}

foldersToProcess.forEach(function(folder) {
    processFiles(path.join(platformPath, folder));
});

function processFiles(dir) {
    fs.readdir(dir, function (err, list) {
        if (err) {
            console.log('processFiles err: ' + err);
            return;
        }
        list.forEach(function(file) {
            file = path.join(dir, file);
            fs.stat(file, function(err, stat) {
                if (recursiveFolderSearch && stat.isDirectory()) {
                    processFiles(file);
                } else{
                    compress(file);
                }
            });
        });
    });
}

function compress(file) {
    var ext = path.extname(file);
    switch(ext) {
        case '.js':
            console.log('uglifying js file ' + file);
            var res = ngAnnotate(String(fs.readFileSync(file)), { add: true });
            var result = UglifyJS.minify(res.src, {
                compress: { // pass false here if you only want to minify (no obfuscate)
                    drop_console: true // remove console.* statements (log, warn, etc.)
                },
                fromString: true
            });
            fs.writeFileSync(file, result.code, 'utf8'); // overwrite the original unminified file
            break;
        default:
            console.log('encountered a ' + ext + ' file, not compressing it');
            break;
    }
}