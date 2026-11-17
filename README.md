# RideKaro - MERN Ride Sharing App

A full-stack ride-sharing application built using React (Vite), Node.js, Express.js, and MongoDB.

## Features

- Splash Screen
- OTP Login
- Home Screen
- Choose Ride
- Driver Assignment
- Live Ride Status (Demo)
- Payment
- Ride Completion and Rating
- My Rides
- User Profile
- Wallet
- Saved Addresses
- Offers and Support

## Tech Stack

**Frontend:**
- React.js
- Vite
- JavaScript
- CSS

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```text
RideSharingApp/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── constants.js
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

Before running this project, install:

1. Node.js 18 or above
2. MongoDB (Local MongoDB or MongoDB Atlas)
3. Git

## Installation

Clone the repository:

```bash
git clone https://github.com/akshaykumardeval77-star/RideSharingApp.git
```

Go to the project directory:

```bash
cd RideSharingApp
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file inside the `server` folder.

Add your configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Use your own MongoDB connection string and a secure JWT secret.

## Run the Project

Start both frontend and backend:

```bash
npm run dev
```

Open in browser:

```text
http://localhost:5173
```

## Demo Login

- Enter any 10-digit mobile number.
- Click Send OTP.
- Demo OTP: `123456`

Google and Apple login options are demo interfaces, not real OAuth authentication.

## Production Build

Build the frontend:

```bash
npm --prefix client run build
```

Start the backend:

```bash
npm start
```

## Future Improvements

- Real SMS OTP Integration
- Google Maps Integration
- Live Driver Tracking
- Razorpay Payment Gateway
- Socket.io Real-Time Updates
- Improved Authentication and Security

## Author

**Akshay Kumar Deval**

GitHub: https://github.com/akshaykumardeval77-star

---

**RideKaro - Making Every Journey Easier!**