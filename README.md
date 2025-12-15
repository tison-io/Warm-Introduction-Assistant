# Warm Introduction Assistant 🤝

<p align="center">
  <img src="https://warmly-intro-assistant.vercel.app/logo.png" alt="Warm Introduction Assistant Logo" width="120" />
</p>

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://warmly-intro-assistant.vercel.app)
[![API](https://img.shields.io/badge/Backend-API-blue)](https://warm-intro-assistant.onrender.com)
> ⚠️ The backend API may take a few seconds to respond on first request due to cold starts.

A platform that connects startups with investors through warm introductions, making fundraising more personal and effective.

 **Quick Overview**

- Warm Introduction Assistant is a full-stack platform that helps startup founders get warm introductions to investors instead of cold outreach, using structured profiles, automated intro workflows, and an AI-powered transform engine.

### Who it’s for

1. 🚀 Startup founders seeking to raise capital for their statups and managing investor outreach

2. 💼 Investors reviewing startups and managing their deal pipeline


## What It Does

**For Startups:**
- Create detailed company profiles with pitch decks and descriptive blurbs
- Browse and connect with relevant investors
- Add the relevant investor profiles
- Get warm introductions for investor through transform engine
- Queue intros and send automated mails to the respective investors
- Set follow-up dates for the sent intros
- Set reminders for investor meetings

**For Investors:**
- Discover promising startups in your investment areas
- Review detailed company information and metrics in your preferred intro format
- Connect with founders
- Manage your investment pipeline efficiently

### Why it matters

- Replaces cold emails with personalized, structured warm introductions

- Streamlines fundraising workflows with reminders, analytics, and automated mails

- Demonstrates a real-world SaaS architecture with AI, streaming UI, and scalable backend design

## Key Features

### 🏢 **Startup Management**
- Company profile creation with name, blurb(description), and pitch link
- Funding stage and amount tracking
- Industry and location categorization

### 💼 **Investor Discovery**
- Browse investor profiles with investment preferences
- Filter by industry, stage, and location
- View investment history and portfolio companies
- Contact information and social profiles
- Create investor profiles with the compiled details

### **Transform Engine**
- Uses template rules(i.e., max 300 chars, 3-bullet lines and email) to format blurb to investor preference
- Includes key traction points

### **Intro-queue management**
- Send automated mails containing transformed intros to the respective investors
- Set follow-up dates on sent intros to track progress

### 🔔 **Smart Reminders**
- Automated follow-up reminders
- Introduction status updates
- Customizable reminder schedules

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

## Technology Stack

**Frontend:**
- Next.js 14 with enforced TypeScript
- React with modern hooks
- Tailwind CSS for styling
- Real-time streaming UI

**Backend:**
- Node.js with NestJS framework
- Enforced Typescript
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
```

```bash
# Backend
cd server
npm install
```

3. **Environment variables Setup**
```bash
# Client (.env.local)
NEXT_PUBLIC_FOUNDER_API_URL=http://localhost:4000
```

```bash
# Server (.env)
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_API_KEY=your_resend_api_key
CONTACT_RECEIVER_EMAIL=kashbel747@gmail.com
```

4. **Run the application**
```bash
# Backend (Terminal 1)
cd server
npm run start:dev
```

- Open another new terminal then
```bash
# Frontend (Terminal 2)
cd client
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Features Overview

### Authentication & Profiles
- User registration
- Secure JWT-based authentication
- Country code support for international users

### Introduction Workflow
1. **Discovery** - Add your startup and find relevant investors
2. **Connection** - Request warm introductions from the transform engine
3. **Introduction** - Automated emails of intros to investors
4. **Follow-up** - Set follow-up due date and get timely in-app reminders
5. **Meeting** - Schedule and manage investor meetings

### AI Assistant
- Context-aware responses about fundraising
- Guidance on investor conversations
- Best practices for startup pitching
- Real-time streaming responses

## API Endpoints

### Authentication(Founders)
- `POST /founder/signup` - User registration
- `POST /founder/login` - User login
- `GET /founder/me` - Get user profile
- `PATCH /founder/profile` - Update user profile

### Startups
- `GET /startups` - List all startups
- `POST /startups` - Create startup profile
- `GET /startups/:id` - Get startup details
- `PATCH /startups/:id` - Update startup
- `DELETE /startups/:id` - Delete startup

### Investors
- `GET /investors` - List all investors
- `POST /investors` - Add investor
- `GET /investors/:id` - Get investor details
- `PATCH /investors/:id` - Update investor details
- `DELETE /investors:id` - Delete investor

### Transform
- `POST /intros/transform` - Send blurb and preffered format to transform engine
- `POST /intros/queue` -  Queue a new intro   
- `GET /intros/my-queue` - List all your personal intro-queues
- `PATCH /intros/:id/status` - Update intro status

### Reminders
- `GET /reminders` - List personal reminders
- `PATCH /reminders/:id/complete` - Mark reminder and intro complete
- `DELETE /reminders/:id` - Delete reminder


### Contact Submissions form
- `POST /contact` - Send contact enquiries 


### Chatbot
- `POST /chat` - Send message to AI assistant

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support and questions:
- Create an issue on GitHub
- Submit your question through the in-app contact form
- Contact the development team
- Check the documentation wiki

---

**Built with passion for the startup ecosystem**
