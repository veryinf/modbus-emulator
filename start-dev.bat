@echo off
chcp 65001
title Modbus模拟器开发服务
for /f "delims=" %%i in ('powershell -Command "Get-Date -Format 'yyyyMMddHHmm'"') do set buildTime=%%i

echo 正在编译源码...
go build -ldflags="-s -w -X veryinf/emulator/core.buildEnv=production -X veryinf/emulator/core.buildVersion=v1.0.0 -X veryinf/emulator/core.buildTime=%buildTime%" -o me.exe cmd\main.go
echo 运行开发服务...
me.exe --http-addr=0.0.0.0:4010