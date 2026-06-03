# Medication Reminder & Tracker App (Healthcare Assistant)

A modern, full-stack healthcare application that helps users manage their medications with intelligent reminders, adherence tracking, and AI-powered health insights.

## 🚀 Features

### Core Features
- **Medication Management**: Add, edit, and organize medications with dosage information
- **Smart Reminders**: Customizable medication reminders with sound notifications
- **Adherence Tracking**: Monitor medication compliance with detailed analytics
- **Stock Management**: Track medication inventory with low-stock alerts
- **AI Health Assistant**: Chat with AI for medication guidance and health tips

### Modern UI/UX
- **Glass Morphism Design**: Modern, translucent interface elements
- **Smooth Animations**: Framer Motion powered transitions and effects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching capability
- **Interactive Charts**: Visual analytics for medication adherence

### AI Integration
- **Gemini AI Integration**: Powered by Google's Gemini AI for health insights
- **Personalized Recommendations**: AI-driven medication timing suggestions
- **Health Chat Assistant**: 24/7 AI support for medication questions

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React (modern, consistent icons)
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **AI**: Google Generative AI (Gemini)

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Database**: MongoDB Atlas
- **Security**: Spring Security with JWT
- **Validation**: Jakarta Validation
- **Build Tool**: Maven

## 📁 Project Structure

```
medication-tracker-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # Spring Boot backend API
│   ├── src/main/java/com/meditracker/backend/
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access layer
│   │   ├── model/          # Entity models
│   │   ├── config/         # Configuration classes
│   │   └── exception/      # Custom exceptions
│   ├── pom.xml
│   └── application.yml
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.6+
- MongoDB Atlas account

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update MongoDB connection in `src/main/resources/application.yml`:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb+srv://your-username:your-password@cluster0.mongodb.net/medication_tracker?retryWrites=true&w=majority
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080/api`

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GEMINI_API_KEY=your-gemini-api-key
```

#### Backend (application.yml)
```yaml
spring:
  data:
    mongodb:
      uri: your-mongodb-atlas-connection-string
jwt:
  secret: your-jwt-secret-key
  expiration: 86400000
```

## 📱 Application Pages

1. **Dashboard**: Overview of medications, reminders, and adherence stats
2. **Medications**: Manage medication list with CRUD operations
3. **Reminders**: Set up and manage medication reminders
4. **Analytics**: Visual charts and adherence tracking
5. **AI Insights**: Chat with AI assistant for health guidance

## 🎨 Design Features

- **Modern Glass Morphism**: Translucent cards with backdrop blur effects
- **Gradient Backgrounds**: Beautiful color gradients throughout the app
- **Smooth Animations**: Page transitions and hover effects
- **Responsive Grid Layouts**: Adapts to different screen sizes
- **Interactive Elements**: Hover states and click animations
- **Custom Color Palette**: Carefully chosen colors for healthcare theme

## 🔒 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- CORS configuration for secure cross-origin requests
- Input validation and sanitization
- Protected API endpoints

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway)
```bash
mvn clean package
# Deploy the generated JAR file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent health insights
- Lucide React for beautiful icons
- Framer Motion for smooth animations
- Tailwind CSS for rapid styling
- Spring Boot community for excellent documentation

## 📞 Support

For support, email support@meditracker.com or join our Slack channel.

---

**Built with ❤️ for better healthcare management**