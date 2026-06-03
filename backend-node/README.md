# Medication Tracker Backend - Node.js/Express

MERN Stack backend converted from Java Spring Boot.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Update `.env` file with your MongoDB connection string (already configured).

### 3. Run Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

**Server URL:** `http://localhost:8080/api`

## 📁 Project Structure

```
backend-node/
├── models/              # Mongoose schemas
│   ├── Medication.js
│   └── Reminder.js
├── controllers/         # Business logic
│   ├── medicationController.js
│   ├── reminderController.js
│   └── aiInsightsController.js
├── routes/             # API routes
│   ├── medicationRoutes.js
│   ├── reminderRoutes.js
│   └── aiInsightsRoutes.js
├── server.js           # Main entry point
├── .env               # Environment variables
└── package.json       # Dependencies
```

## 🔧 API Endpoints

### Medications
- `GET /api/medications?userId=user1` - Get all medications
- `POST /api/medications` - Create medication
- `PUT /api/medications/:id?userId=user1` - Update medication
- `DELETE /api/medications/:id?userId=user1` - Delete medication
- `GET /api/medications/low-stock?userId=user1` - Get low stock items
- `GET /api/medications/stats?userId=user1` - Get statistics

### Reminders
- `GET /api/reminders?userId=user1` - Get all reminders
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/:id?userId=user1` - Update reminder
- `DELETE /api/reminders/:id?userId=user1` - Delete reminder
- `PATCH /api/reminders/:id/taken?userId=user1` - Mark as taken
- `PATCH /api/reminders/:id/undo-taken?userId=user1` - Undo taken

### AI Insights
- `GET /api/ai-insights/:userId` - Get insights
- `POST /api/ai-insights/:userId/refresh` - Refresh insights

## 🔄 Migration from Java

All Java Spring Boot functionality has been converted to Node.js/Express:
- ✅ MongoDB integration (Mongoose instead of Spring Data)
- ✅ REST API endpoints (Express instead of Spring MVC)
- ✅ CORS configuration
- ✅ All CRUD operations
- ✅ AI insights generation
- ✅ Same API structure (compatible with existing frontend)

## 💡 Key Differences

| Java Spring Boot | Node.js/Express |
|-----------------|-----------------|
| `@RestController` | `express.Router()` |
| `@Autowired` | ES6 imports |
| JPA Repositories | Mongoose models |
| `application.yml` | `.env` file |
| Maven | npm |

## 🎯 No Frontend Changes Required

The API structure is identical to the Java backend, so your React frontend will work without any modifications!
