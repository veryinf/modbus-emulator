@echo off
set "IMAGE_TAG=git.chuangyun.work/archive/modbus-emulator:1.0.0"

echo Building Docker image with tag: %IMAGE_TAG%
docker build -t %IMAGE_TAG% .

if %errorlevel% neq 0 (
    echo Error: Docker build failed
    exit /b 1
)

echo Docker image built successfully

echo Pushing Docker image to registry...
docker push %IMAGE_TAG%

if %errorlevel% neq 0 (
    echo Error: Docker push failed
    exit /b 1
)

echo Docker image pushed successfully: %IMAGE_TAG%

pause