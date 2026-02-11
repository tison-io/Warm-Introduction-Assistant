# Warm Introduction Assistant 🤝

<p align="center">
  <img
    src="https://warmly-intro-assistant.vercel.app/logo.png"
    alt="Warm Introduction Assistant Logo"
    width="120"
  />
</p>

<p align="center">
  <a href="https://warmly-intro-assistant.vercel.app">
    <img src="https://img.shields.io/badge/Live-Demo-green" alt="Live Demo" />
  </a>
  <a href="https://warm-intro-assistant.onrender.com">
    <img src="https://img.shields.io/badge/Backend-API-blue" alt="Backend API" />
  </a>
</p>

> ⚠️ The backend API may take a few seconds to respond on first request due to cold starts.

A specialized platform designed for community owners that automates the tedious process of manually crafting and managing introductions between founders and investors.

**🚩 The Core Problem**

- Community owners often act as the "bottleneck" in fundraising. Manually drafting emails, checking preferences, and following up on double opt-ins takes hours of manual labor. This tool acts as an AI-powered connector, reducing manual work by up to 80%.

**💡 The Solution**
This tool acts as an AI-powered connector, streamlining the transition from a founder's request to a successful intro, reducing manual community owner work by up to 80%.

## Key Features

### 🏢 **Ecosystem Management**
- **Startup Profiles**: Receive founder requests and store their details e.g., name, email, startup blurb, pitch deck, and their investor target tags.
- **Investor CRM**: Maintain a private network of investors with specific investment preferences and intro styles


### **Transform Engine**
- Uses template rules(i.e., max 300 chars, 3-bullet lines and email) to format blurb to investor preference
- Includes key traction points

### **Automated Intro-queue**
- **Consent Management**: Built-in Double Opt-in workflow. No more "surprising" investors with unwanted mails
- **Consent Management**: Once consent is approved by both founder and investor, the final intro mail is sent to both parties simultaneously
- **Follow-up**: Set follow-up dates on sent intros to track progress

### 🔔 **Smart Tracking**
- **Follow-up Reminders**: Automated alerts community owner to follow up on an intro based on follow-up date set.

### 🤖 **AI-Powered Chatbot**
- Get guidance on investor conversations
- Receive personalized introduction advice
- Ask questions about fundraising best practices
- Real-time streaming responses with typing effect

### 📊 **Dashboard & Analytics**
- Overview of founder requests
- Smart reminders
- Activity logsof intro outcomes

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
- JWT authentication + Google OAuth
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
# Client (.env.local) - Optional
NEXT_PUBLIC_FOUNDER_API_URL=http://localhost:4000
```

```bash
# Server (.env)

#Ports config
PORT=4000
FRONTEND_URL=http://localhost:3000

# Database & Auth
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_random_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# Resend Email Config
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
CONTACT_RECEIVER_EMAIL=your_admin_email@example.com

# Brevo Email Config
BREVO_HOST=smtp-relay.brevo.com
BREVO_PORT=587
BREVO_USERNAME=your_brevo_username
BREVO_PASSWORD=your_brevo_smtp_password
BREVO_FROM_EMAIL=your_verified_sender_email@example.com
BREVO_API_KEY=xkeysib-your_api_key
BREVO_FROM_NAME="Warm Introduction Assistant"

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=usd
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

## API Endpoints

### Authentication(Founders)
- `POST /founder/signup` - User registration
- `POST /founder/login` - User login
- `GET /founder/me` - Get user profile
- `PATCH /founder/profile` - Update user profile


### Startups
- `GET /startups` - List all founder requests
- `POST /startups` - Create founder request
- `GET /startups/:id` - Get startup details
- `PATCH /startups/:id` - Update startup
- `DELETE /startups/:id` - Delete startup

### Investors
- `GET /investors` - List all investors
- `POST /investors` - Add investor
- `GET /investors/:id` - Get investor details
- `PATCH /investors/:id` - Update investor details
- `DELETE /investors:id` - Delete investor

### Intro-flow
- `POST /intros/transform` - Send blurb and preffered format to transform engine
- `POST /intros/queue` -  Queue a new intro   
- `GET /intros/my-queue` - List all your personal intro-queues
- `PATCH /intros/:id` - Update intro
- `PATCH /intros/:id/status` - Update intro status
- `POST /intros/:id/request-consent` - Send the double opt-in email to investor and founder to ask if they want the intro
- `Post /intros/:id/approve` - Triggered when the investor and founder agrees; sends the final warm intro to both parties

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

---

**Built with passion for the startup ecosystem to help community owners scale thir impact.**
