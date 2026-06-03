# Medication Tracker Backend

Spring Boot REST API for the Medication Tracker application.

## Quick Start (Without Maven)

Since Maven is not available, use the provided batch file:

```bash
# Run the backend
run.bat
```

## Alternative: Install Maven First

1. **Install Maven via Chocolatey:**
```bash
choco install maven -y
```

2. **Restart your terminal/PowerShell**

3. **Run with Maven:**
```bash
mvn spring-boot:run
```

## Manual Java Compilation

If you prefer to compile manually:

```bash
# Create target directory
mkdir target\classes

# Compile Java files
javac -cp "src/main/java" -d "target/classes" src/main/java/com/meditracker/backend/*.java src/main/java/com/meditracker/backend/*/*.java

# Run the application
java -cp "target/classes" com.meditracker.backend.MedicationTrackerApplication
```

## Configuration

Update `src/main/resources/application.yml` with your MongoDB Atlas connection:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb+srv://your-username:your-password@cluster0.mongodb.net/medication_tracker
```

## API Endpoints

- `GET /api/medications` - Get all medications
- `POST /api/medications` - Create medication
- `PUT /api/medications/{id}` - Update medication
- `DELETE /api/medications/{id}` - Delete medication

## Port

Backend runs on: `http://localhost:8080/api`