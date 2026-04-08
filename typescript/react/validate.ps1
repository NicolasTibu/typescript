#!/usr/bin/env pwsh
# Script de validación para Laboratorio 3

$ProjectPath = "C:\Corner Studios\typescript\react"
Write-Host "🧪 Validación del Laboratorio 3: React + TypeScript" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Verificar que exist npm
Write-Host "📦 Paso 1: Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    Write-Host "✅ npm $npmVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no encontrado. Instala Node.js desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Paso 2: Navegar al proyecto
Write-Host ""
Write-Host "📂 Paso 2: Navegando al proyecto..." -ForegroundColor Yellow
if (Test-Path $ProjectPath) {
    Set-Location $ProjectPath
    Write-Host "✅ Directorio: $ProjectPath" -ForegroundColor Green
} else {
    Write-Host "❌ Directorio no encontrado: $ProjectPath" -ForegroundColor Red
    exit 1
}

# Paso 3: Instalar dependencias
Write-Host ""
Write-Host "📥 Paso 3: Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

# Paso 4: Validar tipos
Write-Host ""
Write-Host "🔍 Paso 4: Validando tipos (tsc --noEmit)..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅✅✅ ¡VALIDACIÓN EXITOSA! ✅✅✅" -ForegroundColor Green
    Write-Host "0 errores de tipo encontrados" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Errores de tipo encontrados - revisar arriba" -ForegroundColor Red
    exit 1
}

# Paso 5: Iniciar desarrollo (opcional)
Write-Host ""
Write-Host "🚀 Paso 5: ¿Iniciar servidor de desarrollo?" -ForegroundColor Yellow
$response = Read-Host "Presiona 'y' para iniciar Vite dev, cualquier otra tecla para salir"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "🔥 Iniciando npm run dev..." -ForegroundColor Cyan
    npm run dev
} else {
    Write-Host "✅ Listo. Ejecuta 'npm run dev' para iniciar más tarde." -ForegroundColor Green
}
