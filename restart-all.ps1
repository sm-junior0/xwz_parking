$ErrorActionPreference = "Stop"

$projectRoot = "C:\Users\Manene\Documents\RCA\Y3\Projects\xwz-parking-system"
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

Write-Host "Stopping old Node processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Recreating PostgreSQL database xwz_parking..."
$dropCreateSql = @"
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'xwz_parking'
  AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS xwz_parking;
CREATE DATABASE xwz_parking;
"@

$tempSql = Join-Path $projectRoot "reset-db.sql"
Set-Content -LiteralPath $tempSql -Value $dropCreateSql -Encoding ASCII
$env:PGPASSWORD = "1234"
& psql -U postgres -h localhost -d postgres -f $tempSql
Remove-Item -LiteralPath $tempSql -Force

Write-Host "Building backend..."
Set-Location $backendPath
npm run build

Write-Host "Building frontend..."
Set-Location $frontendPath
npm run build

Write-Host "Starting backend services..."
Start-Process powershell -ArgumentList "-NoProfile", "-Command", "Set-Location '$backendPath'; node dist\services\auth-service\src\server.js"
Start-Process powershell -ArgumentList "-NoProfile", "-Command", "Set-Location '$backendPath'; node dist\services\parking-service\src\server.js"
Start-Process powershell -ArgumentList "-NoProfile", "-Command", "Set-Location '$backendPath'; node dist\services\car-service\src\server.js"
Start-Process powershell -ArgumentList "-NoProfile", "-Command", "Set-Location '$backendPath'; node dist\services\report-service\src\server.js"
Start-Process powershell -ArgumentList "-NoProfile", "-Command", "Set-Location '$backendPath'; node dist\services\api-gateway\src\server.js"

Write-Host "Starting frontend..."
Start-Process powershell -ArgumentList "-NoProfile", "-Command", "Set-Location '$frontendPath'; node serve-build.js"

Write-Host ""
Write-Host "All services restarted."
Write-Host "Frontend: http://localhost:3000"
Write-Host "Gateway:  http://localhost:5000/health"
Write-Host "Auth docs:    http://localhost:5001/api-docs"
Write-Host "Parking docs: http://localhost:5002/api-docs"
Write-Host "Car docs:     http://localhost:5003/api-docs"
Write-Host "Report docs:  http://localhost:5004/api-docs"
