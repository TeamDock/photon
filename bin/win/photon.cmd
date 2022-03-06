: Used from https://github.com/vercel/hyper/blob/canary/build/win/hyper (adapted)
@echo off
setlocal
set ELECTRON_RUN_AS_NODE=1
call "%~dp0..\..\Photon.exe" "%~dp0\cli.js" %*
endlocal