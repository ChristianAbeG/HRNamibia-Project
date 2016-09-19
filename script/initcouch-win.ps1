$ErrorActionPreference="Stop"

$couch="http://127.0.0.1:5984"
Invoke-RestMethod -Uri "$couch/_config/admins/couchadmin" -Method PUT -Body '"test"'

$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("couchadmin:test"))

$body1='{ "admins": { "names": [], "roles": ["admin"]}, "members": { "names": [], "roles": []}}'
$body2='{ "admins": { "names": [], "roles": ["admin"]}, "members": { "names": [], "roles": ["user"]}}'
$body3='"{couch_httpd_oauth, oauth_authentication_handler}, {couch_httpd_auth, proxy_authentification_handler}, {couch_httpd_auth, cookie_authentication_handler}, {couch_httpd_auth, default_authentication_handler}"'
$body4='{"name": "hradmin", "password": "test", "roles": ["System Administrator","admin","user"], "type": "user", "userPrefix": "p1"}'

Invoke-RestMethod -Uri "$couch/_users/_security" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method PUT -Body $body1
Invoke-RestMethod -Uri "$couch/config" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method PUT
Invoke-RestMethod -Uri "$couch/config/_security" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method PUT -Body $body1
Invoke-RestMethod -Uri "$couch/main" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method PUT
Invoke-RestMethod -Uri "$couch/main/_security" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method PUT -Body $body2
Invoke-RestMethod -Uri "$couch/_config/http/authentication_handlers" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method PUT -Body $body3
Invoke-RestMethod -Uri "$couch/_config/couch_httpd_oauth/use_users_db" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method PUT -Body '"true"'
Invoke-RestMethod -Uri "$couch/_users/org.couchdb.user:hradmin" -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method PUT -Body $body4
