$ErrorActionPreference="Stop"

$couchservice=Get-Service "Apache CouchDB"

if( $couchservice.Status -ne "Running" ) {
    Try {
        Start-Service $couchservice
    }
    Catch {
        Write-Host "CouchDB could not be started - ensure it is installed. Aborting."
        exit 1
    }
}