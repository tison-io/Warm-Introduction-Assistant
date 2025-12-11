# Warm Introduction Assistant 🤝

A platform that connects startups with investors through warm introductions, making fundraising more personal and effective.

## What It Does

**For Startups:**
- Create detailed company profiles with pitch decks and metrics
- Browse and connect with relevant investors
- Get warm introductions through mutual connections
- Track introduction progress and follow-ups
- Set reminders for investor meetings

**For Investors:**
- Discover promising startups in your investment areas
- Review detailed company information and metrics
- Connect with founders through trusted introductions
- Manage your investment pipeline efficiently

## Key Features

### 🏢 **Startup Management**
- Company profile creation with logo, description, and key metrics
- Pitch deck upload and sharing
- Funding stage and amount tracking
- Industry and location categorization

### 💼 **Investor Discovery**
- Browse investor profiles with investment preferences
- Filter by industry, stage, and location
- View investment history and portfolio companies
- Contact information and social profiles

### 🤖 **AI-Powered Chatbot**
- Get guidance on investor conversations
- Receive personalized introduction advice
- Ask questions about fundraising best practices
- Real-time streaming responses with typing effect

### 📊 **Dashboard & Analytics**
- Overview of all introductions and their status
- Upcoming meetings and reminders
- Progress tracking for fundraising goals
- Activity timeline and notifications

### 🔔 **Smart Reminders**
- Automated follow-up reminders
- Meeting preparation notifications
- Introduction status updates
- Customizable reminder schedules

## Technology Stack

**Frontend:**
- Next.js 14 with TypeScript
- React with modern hooks
- Tailwind CSS for styling
- Real-time streaming UI

**Backend:**
- Node.js with NestJS framework
- MongoDB with Mongoose ODM
- JWT authentication
- RESTful API design

**AI Integration:**
- Custom chatbot with streaming responses
- Session-based conversation management
- Context-aware responses about fundraising

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- Environment variables configured

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/DirectEd-Development/Warm-Introduction-Assistant.git
cd Warm-Introduction-Assistant
```

2. **Install dependencies**
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

3. **Environment Setup**
```bash
# Client (.env.local)
NEXT_PUBLIC_FOUNDER_API_URL=http://localhost:4000

# Server (.env)
PORT=4000
MONGO_URI=mongodb://localhost:27017/warm-intro
JWT_SECRET=your-jwt-secret-key
```

4. **Run the application**
```bash
# Backend (Terminal 1)
cd server
npm run start:dev

# Frontend (Terminal 2)
cd client
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Features Overview

### Authentication & Profiles
- User registration with email/phone verification
- Secure JWT-based authentication
- Profile management with image upload
- Country code support for international users

### Introduction Workflow
1. **Discovery** - Find relevant investors or startups
2. **Connection** - Request warm introductions
3. **Introduction** - Automated introduction emails
4. **Follow-up** - Track progress and set reminders
5. **Meeting** - Schedule and manage investor meetings

### AI Assistant
- Context-aware responses about fundraising
- Guidance on investor conversations
- Best practices for startup pitching
- Real-time streaming responses

## API Endpoints

### Authentication
- `POST /founder/signup` - User registration
- `POST /founder/login` - User login
- `GET /founder/me` - Get user profile

### Startups
- `GET /startups` - List all startups
- `POST /startups` - Create startup profile
- `GET /startups/:id` - Get startup details
- `PUT /startups/:id` - Update startup

### Investors
- `GET /investors` - List all investors
- `POST /investors` - Add investor
- `GET /investors/:id` - Get investor details

### Chatbot
- `POST /chat` - Send message to AI assistant

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for the startup ecosystem**