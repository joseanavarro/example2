#!/bin/bash

echo "Adjusting plist for App Transport Security exception."
val=$(/usr/libexec/plistbuddy -c "Add :NSAppTransportSecurity:NSExceptionDomains:www.walk2view.com dict" platforms/ios/Walk2view/Walk2view-Info.plist 2>/dev/null)
val=$(/usr/libexec/plistbuddy -c "Add :NSAppTransportSecurity:NSExceptionDomains:www.walk2view.com:NSIncludesSubdomains bool true" platforms/ios/Walk2view/Walk2view-Info.plist 2>/dev/null)
val=$(/usr/libexec/plistbuddy -c "Add :NSAppTransportSecurity:NSExceptionDomains:www.walk2view.com:NSExceptionAllowsInsecureHTTPLoads bool true" platforms/ios/Walk2view/Walk2view-Info.plist 2>/dev/null)
val=$(/usr/libexec/plistbuddy -c "Add :NSAppTransportSecurity:NSExceptionDomains:www.walk2view.com:NSExceptionMinimumTLSVersion string 'TLSv1.0'" platforms/ios/Walk2view/Walk2view-Info.plist 2>/dev/null)
echo "Done"
