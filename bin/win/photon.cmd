: Used from https://github.com/vercel/hyper/blob/canary/build/win/hyper (adapted)
@echo off
setlocal
set ELECTRON_RUN_AS_NODE=1
call "%~dp0..\..\photon.exe" "%~dp0..\..\resources\bin\cli.js" %*
endlocal