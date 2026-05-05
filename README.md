# Insta-News 📰

A modern, production-ready personalized news platform built with the MERN stack (MongoDB, Express, React, Node.js). 

Insta-News delivers real-time news across multiple categories, tracks live sports scores, and provides intelligent AI-powered article summaries using Google's Gemini AI. The application features a stunning glassmorphism design, secure user authentication with Clerk, and persistent personal preferences.

## 🌟 Key Features

*   **Dynamic Personalized Feed:** Users can securely log in via Clerk to select their favorite topics (Tech, Sports, Health, etc.) and receive a tailored "My News" dashboard.
*   **AI Summarization:** Powered by Gemini AI to generate instant, intelligent summaries of long news articles directly in a beautiful modal.
*   **Secure Authentication:** End-to-end authentication via Clerk, handling user sessions and Google OAuth securely.
*   **Persistent Preferences:** User data, bookmarks, and reading history are securely stored in a MongoDB database.
*   **Live Sports Integration:** Real-time cricket score tracking with intelligent status parsing.
*   **Modern Premium UI:** Built with Tailwind CSS, featuring glassmorphism panels, neon glows, vibrant fuchsia/violet accents, and responsive animations.
*   **Dark/Light Mode:** Seamless theme toggling with persistent state.

## 🛠 Tech Stack

*   **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router DOM, Clerk React.
*   **Backend:** Node.js, Express, Mongoose, Google GenAI SDK.
*   **Database:** MongoDB Atlas.
*   **Authentication:** Clerk.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas Cluster
* Clerk Account
* Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/insta-news.git
   cd insta-news
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd client && npm install

   # Install backend dependencies
   cd ../server && npm install
   ```

3. **Environment Setup**
   You need to set up two environment files.

   Create `client/.env.local`:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

   Create `server/.env`:
   ```env
   PORT=3004
   GEMINI_API_KEY=your_gemini_api_key
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the Application**
   From the root directory:
   ```bash
   npm run dev
   ```
   This will concurrently start the Vite frontend (port 5173) and the Express backend (port 3004).
