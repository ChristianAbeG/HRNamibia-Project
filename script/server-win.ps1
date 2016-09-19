$ErrorActionPreference="Stop"

function warn {
    if( Test-Path "script\couchdb-win.ps1" ) {
        PowerShell -NoProfile -NonInteractive -File "script\couchdb-win.ps1"
        if( $LASTEXITCODE -eq 0 ) {
            start_ember
            return
        } #If this condition doesn't catch, then fall through to warning and exit.
    }
    Write-Host "Oops! Looks like CouchDB isn't running. CouchDB must be installed and running before you can start HospitalRun."
    exit 1
}

function check_couchdb {
    $server="http://127.0.0.1:5984"
    Try {
        Invoke-RestMethod $server > $null
    }
    Catch {
        return $false
    }
    return $true
}

function retry_check {
    param( [int]$retries )
    $interval=3
    $success=$false

    for($i=0; $i -lt $retries; $i++) {
        if( !(check_couchdb) ) {
            Write-Host "." -NoNewline
            Start-Sleep -s $interval
        }
        else {
            $success=$true
            break
        }
    }
    return $success
}

function start_ember {
    Write-Host "CouchDB OK. Starting ember server."
    ember serve
}

Write-Host "Checking CouchDB..." -NoNewline
if( retry_check 3 ) {
    start_ember
}
else {
    warn
}