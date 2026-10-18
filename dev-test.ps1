# Script pour lancer API + web en dev

Write-Host "🚀 Démarrage API locale..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "dev-server.js" -WorkingDirectory "apps/api"

Start-Sleep -Seconds 2

Write-Host "🌐 Démarrage web MVP..." -ForegroundColor Green
Write-Host "   Accès sur http://localhost:5173" -ForegroundColor Yellow
Write-Host "   API locale sur http://localhost:3001" -ForegroundColor Yellow

$env:VITE_API_URL = "http://localhost:3001"
cd "apps/web"
yarn dev
