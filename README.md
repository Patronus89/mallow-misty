Voice AI Assistant - Restaurant & Financial Services
A complete Python-based Voice AI solution that handles phone calls for restaurant reservations and financial services inquiries using FastAPI, Twilio, and OpenAI.
🎯 What This Project Does

Restaurant Assistant: Takes reservations, answers menu questions, sends confirmations
Financial Services: Handles after-hours inquiries, collects customer info, notifies staff
Real Phone Calls: Integrates with Twilio for actual voice conversations
AI-Powered: Uses OpenAI for intelligent responses and conversation handling
Production Ready: Deployed on Railway with proper error handling and monitoring

🚀 Live Demo

Production URL: https://voiceflow-production-5d8b.up.railway.app
Health Check: https://voiceflow-production-5d8b.up.railway.app/health
Admin Dashboard: https://voiceflow-production-5d8b.up.railway.app/admin/stats

📞 Features
Restaurant Voice Assistant

✅ Smart Reservations: AI collects date, time, party size, contact info
✅ Menu Q&A: Answers questions about dishes, prices, allergens
✅ SMS Confirmations: Automatic reservation confirmations via text
✅ Database Storage: All reservations saved with customer details
✅ Natural Conversation: Handles complex, multi-turn conversations

Financial Services Agent

✅ Business Hours Detection: Routes to staff during hours, AI after hours
✅ Priority Classification: Urgent, high, medium, low priority handling
✅ Information Collection: Systematically gathers customer details
✅ Staff Notifications: Emails and SMS alerts for follow-up
✅ Compliance Ready: Secure handling of financial inquiries

Technical Features

✅ Production Deployment: Running 24/7 on Railway cloud platform
✅ Database Integration: PostgreSQL with SQLAlchemy ORM
✅ Real-time Webhooks: Twilio voice call handling
✅ AI Integration: OpenAI GPT for intelligent responses
✅ Admin Interface: Monitor reservations and inquiries
✅ Error Handling: Robust fallbacks and logging
✅ Scalable Architecture: Docker containerized, cloud-ready

🛠 Technology Stack
ComponentTechnologyPurposeBackendFastAPI + Python 3.11High-performance async web frameworkVoice ProcessingTwilio Voice APIHandle phone calls and TwiML responsesAI EngineOpenAI GPT-3.5-turboNatural language understanding and generationDatabasePostgreSQL + SQLAlchemyData persistence and ORMSMS/EmailTwilio + SendGridNotifications and confirmationsDeploymentRailway + DockerCloud hosting and containerizationMonitoringBuilt-in logging + Admin endpointsApplication monitoring and debugging
🏗 Project Structure
voice-ai-assistant/
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI application and endpoints
│   ├── models/
│   │   ├── __init__.py
│   │   └── database.py             # SQLAlchemy models and database setup
│   ├── services/
│   │   ├── __init__.py
│   │   ├── voice_service.py        # Voice processing and AI integration
│   │   ├── restaurant_service.py   # Restaurant reservation logic
│   │   ├── financial_service.py    # Financial inquiry handling
│   │   └── notification_service.py # SMS/email notifications
│   └── utils/
│       ├── __init__.py
│       └── helpers.py              # Utility functions
├── config/
│   ├── __init__.py
│   └── settings.py                 # Environment configuration
├── requirements.txt                # Python dependencies
├── .env                           # Environment variables (not in git)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── Dockerfile                     # Docker container configuration
├── docker-compose.yml             # Multi-service Docker setup
├── database_init.py               # Database initialization script
├── run.py                         # Application runner
└── README.md                      # This file
🔧 Installation & Setup
Prerequisites

Python 3.11+
Git
Twilio Account (free $15 credit)
OpenAI Account (with API credits)

Local Development Setup

Clone the repository

bashgit clone https://github.com/YOUR_USERNAME/voice-ai-assistant.git
cd voice-ai-assistant

Create virtual environment

bashpython -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

Install dependencies

bashpip install -r requirements.txt

Configure environment variables

bashcp .env.example .env
# Edit .env with your API keys (see Configuration section)

Initialize database

bashpython database_init.py

Run the application

bashpython run.py

Test locally

bashcurl http://localhost:8000/health
Production Deployment
Deployed on Railway: https://voiceflow-production-5d8b.up.railway.app
The application is containerized with Docker and deployed on Railway cloud platform for 24/7 availability.
⚙️ Configuration
Required Environment Variables
Create a .env file with the following variables:
env# Twilio Configuration (Get from https://console.twilio.com)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# OpenAI Configuration (Get from https://platform.openai.com)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Database Configuration
DATABASE_URL=sqlite:///./voiceai.db  # Local development
# DATABASE_URL=postgresql://user:pass@host:port/db  # Production

# Email Configuration (Optional - SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@yourdomain.com
STAFF_EMAIL=staff@yourdomain.com

# Business Configuration
RESTAURANT_NAME=Your Restaurant Name
RESTAURANT_PHONE=+1234567890
CREDIT_UNION_NAME=Your Credit Union
BUSINESS_HOURS_START=9
BUSINESS_HOURS_END=17
ONCALL_STAFF_PHONE=+1234567890

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True
API Keys Setup

Twilio Setup:

Sign up at https://console.twilio.com
Complete business verification
Buy a phone number
Get Account SID and Auth Token


OpenAI Setup:

Sign up at https://platform.openai.com
Create API key
Add billing information and credits


SendGrid Setup (Optional):

Sign up at https://sendgrid.com
Create API key
Verify sender email



📱 Twilio Webhook Configuration
Webhook URLs
Configure these webhook URLs in your Twilio phone number settings:

Restaurant Calls: https://voiceflow-production-5d8b.up.railway.app/voice/restaurant
Financial Calls: https://voiceflow-production-5d8b.up.railway.app/voice/financial

Setup Instructions

Go to Twilio Console → Phone Numbers → Manage → Active Numbers
Click on your phone number
In "Voice Configuration" section:

Set "A call comes in" to "Webhook"
URL: Your webhook URL
HTTP Method: POST


Save configuration

🎮 Usage Examples
Restaurant Conversation Flow
AI: "Hello! Welcome to Mario's Restaurant. How can I help you today?"

Customer: "I'd like to make a reservation"

AI: "I'd be happy to help with a reservation. What date would you like?"

Customer: "Tomorrow at 7 PM for 4 people"

AI: "Perfect! What name should I put the reservation under?"

Customer: "John Smith"

AI: "Great! What's the best phone number to reach you?"

Customer: "555-123-4567"

AI: "Excellent! I've booked your table for 4 people tomorrow at 7 PM under John Smith. You'll receive a confirmation text shortly."
Financial Services Flow
AI: "Thank you for calling Community Credit Union. Our offices are currently closed, but I can collect your information for follow-up."

Customer: "I think there's fraud on my account"

AI: "I understand this is urgent. Let me get your information so our team can help you first thing tomorrow. What's your full name?"

Customer: "Jane Doe"

AI: "Thank you Jane. What's the best phone number to reach you?"

[Collects information and creates high-priority ticket]
🔌 API Endpoints
Public Endpoints
EndpointMethodDescription/healthGETHealth check and status/voice/restaurantPOSTRestaurant voice webhook/voice/financialPOSTFinancial services webhook
Admin Endpoints
EndpointMethodDescription/admin/statsGETSystem statistics/admin/reservationsGETAll reservations/admin/inquiriesGETAll financial inquiries
API Documentation
FastAPI automatically generates interactive API documentation:

Swagger UI: https://voiceflow-production-5d8b.up.railway.app/docs
ReDoc: https://voiceflow-production-5d8b.up.railway.app/redoc

📊 Database Schema
Tables
Reservations

Customer name, phone, email
Reservation date, time, party size
Special requests, status
Creation and update timestamps

Financial Inquiries

Customer name, phone, email
Inquiry reason and priority level
Call time and follow-up status
Staff notes

Menu Items

Name, description, price
Category, allergens, availability

Call Sessions

Session data for multi-turn conversations
Call SID tracking
Call type and timestamps

🚀 Development Journey
This project was built step-by-step with the following major milestones:
Phase 1: Foundation Setup

✅ Created Python virtual environment
✅ Set up FastAPI application structure
✅ Configured SQLAlchemy database models
✅ Built basic health check endpoints

Phase 2: Voice Integration

✅ Integrated Twilio Voice API
✅ Implemented TwiML response generation
✅ Built voice webhook handlers
✅ Added speech-to-text processing

Phase 3: AI Enhancement

✅ Integrated OpenAI GPT for intelligent responses
✅ Built intent classification system
✅ Implemented conversation state management
✅ Added fallback responses for robustness

Phase 4: Business Logic

✅ Built restaurant reservation system
✅ Implemented financial inquiry handling
✅ Added multi-turn conversation flows
✅ Built data extraction and validation

Phase 5: Notifications

✅ Integrated Twilio SMS for confirmations
✅ Built email notification system
✅ Added staff alert mechanisms
✅ Implemented priority-based routing

Phase 6: Production Deployment

✅ Containerized with Docker
✅ Deployed to Railway cloud platform
✅ Configured production environment variables
✅ Set up monitoring and logging

Phase 7: Testing & Validation

✅ Tested voice endpoints with ngrok
✅ Configured Twilio webhooks
✅ Validated real phone call flows
✅ Completed end-to-end testing

🧪 Testing
Local Testing
bash# Test health endpoint
curl http://localhost:8000/health

# Test voice endpoints
curl -X POST http://localhost:8000/voice/restaurant \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=test123&SpeechResult=I want to make a reservation"

# Test admin endpoints
curl http://localhost:8000/admin/stats
Production Testing
bash# Test production health
curl https://voiceflow-production-5d8b.up.railway.app/health

# Test voice webhooks
curl -X POST https://voiceflow-production-5d8b.up.railway.app/voice/restaurant \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=test123"
Phone Call Testing

Set up ngrok for local webhook testing:
bashngrok http 8000

Configure Twilio webhook with ngrok URL
Call your Twilio number and test conversation flows

🔧 Troubleshooting
Common Issues
"Credentials are required to create a TwilioClient"

Solution: Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in environment variables

"Method Not Allowed" on voice endpoints

Solution: This is correct behavior - voice endpoints only accept POST requests from Twilio

Database connection errors

Solution: Run python database_init.py to initialize the database

OpenAI API errors

Solution: Verify API key is valid and account has credits

Logging
Application logs include:

Incoming call information
Speech recognition results
AI response generation
Database operations
Error tracking

💰 Cost Estimation
Monthly Operational Costs (500 calls)
ServiceCostNotesTwilio Voice$50-100~$0.10-0.20 per callTwilio SMS$10-20~$0.02 per messageOpenAI API$30-80Depends on conversation lengthRailway Hosting$5-20Free tier availableTotal$95-220Scales with usage
Free Tier Benefits

Twilio: $15 free credit
OpenAI: $5 free credit for new accounts
Railway: Free tier with reasonable limits

🚀 Future Enhancements
Planned Features

 Multi-language support with language detection
 Voice cloning for branded voice experiences
 Calendar integration for real-time availability
 Payment processing for deposits and payments
 Analytics dashboard with call metrics
 CRM integration with customer management
 Advanced AI with function calling and tools

Scaling Considerations

Database: Migrate to managed PostgreSQL for production
Caching: Add Redis for session management
Load Balancing: Multiple instances for high availability
Monitoring: Implement APM and alerting systems

🤝 Contributing
Development Setup

Fork the repository
Create a feature branch
Make your changes
Test thoroughly
Submit a pull request

Code Style

Follow PEP 8 for Python code
Use type hints where possible
Add docstrings for public functions
Write tests for new features

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments

FastAPI for the excellent async web framework
Twilio for reliable voice and SMS APIs
OpenAI for powerful AI capabilities
Railway for simple and effective deployment
SQLAlchemy for robust database management

📞 Support
For questions, issues, or feature requests:

Check the issues on GitHub
Create a new issue with detailed information
Review the troubleshooting section above

🎯 Project Stats

Total Development Time: ~2 days
Lines of Code: ~2,000+
Files Created: 20+
APIs Integrated: 3 (Twilio, OpenAI, SendGrid)
Deployment Platform: Railway
Database: PostgreSQL/SQLite
Response Time: <500ms average
Uptime: 99.9% target


Built with ❤️ for businesses that want to provide 24/7 customer service through AI-powered voice assistants.

