@echo off
cd /d d:\Java\order-system\frontend
if exist src (
  echo Removing src directory...
  rmdir /s /q src
  echo Done!
)
echo.
echo Running build...
call npm run build
pause
