# AI PDF QA Application

A sophisticated AI-powered PDF document analysis and question-answering system that combines multiple AI services to provide intelligent document insights.

## 🚀 Overview

This application allows users to upload PDF documents and interact with them through an AI-powered chat interface. The system processes PDFs using LlamaParse, creates vector embeddings with Hugging Face, stores them in a vector database, and provides intelligent responses using Google's Gemini AI.

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
- **Framework**: React 19 with TypeScript for type safety
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS 4 for modern, responsive design
- **PDF Viewer**: React PDF viewer for document display
- **Icons**: FontAwesome for UI icons
- **State Management**: React hooks for local state management

### Backend (Node.js + Express)
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js for RESTful API
- **File Upload**: Multer for handling PDF uploads
- **CORS**: Cross-origin resource sharing enabled
- **Environment**: Dotenv for configuration management

## 🔧 Technology Stack

### AI & ML Services
1. **LlamaParse** - PDF parsing and text extraction
2. **Hugging Face Inference** - Text embeddings using sentence-transformers
3. **Google Gemini AI** - Natural language processing and response generation
4. **ChromaDB** - Vector database for similarity search

### Key Libraries
- **LangChain** - AI/ML framework for document processing
- **Axios** - HTTP client for API calls
- **Form-data** - File upload handling

## 📋 Prerequisites

Before setting up the application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- API keys for the following services:
  - LlamaParse API key
  - Hugging Face API key
  - Google Gemini API key

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd playwork
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install 
```
or 
```bash
npm install --legay-peer-deps
```

Create a `.env` file in the backend directory:
```env
LLAMA_API_KEY=your_llama_parse_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:4000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
Create a `.env` file in the Frontend directory:
```env
VITE_NODE_BACKEND_URL=http://localhost:4000
```
Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`


## 📁 Project Structure

```
playwork/
├── backend/
│   ├── controllers/          # API route handlers
│   ├── services/            # Business logic and external API integrations
│   ├── constants/           # Prompts and demo data
│   ├── uploads/             # Temporary file storage
│   ├── server.js            # Express server setup
│   └── package.json         # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── constants/      # API URLs and constants
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main application component
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🔌 API Endpoints

### Backend API Routes
- `POST /upload` - Upload PDF file
- `GET /get_job_status/:id` - Check PDF processing status
- `GET /getparseddata/:id` - Get parsed PDF data
- `POST /send_user_chat` - Send chat message and get AI response
- `POST /ping_gemini` - Health check for Gemini AI
- `GET /` - Health check endpoint

