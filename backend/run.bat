@echo off
echo Starting Medication Tracker Backend...
echo.

REM Check if Java is installed
java -version
if %errorlevel% neq 0 (
    echo Java is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Compiling and running Spring Boot application...
echo.

REM Compile and run using Java directly
javac -cp "src/main/java" -d "target/classes" src/main/java/com/meditracker/backend/*.java src/main/java/com/meditracker/backend/*/*.java

if %errorlevel% neq 0 (
    echo Compilation failed
    pause
    exit /b 1
)

echo Compilation successful!
echo Starting application on http://localhost:8080/api
echo.

java -cp "target/classes" com.meditracker.backend.MedicationTrackerApplication

pause