$ErrorActionPreference="Stop"

if( !(Test-Path package.json) ) {
    cd ..
    if( !(Test-Path package.json) ) {
        Write-Host "Please execute this script from the root repository directory!"
        exit
    }
}

npm install
npm install -g phantomjs-prebuilt
bower install
cp server/config-example.js server/config.js
