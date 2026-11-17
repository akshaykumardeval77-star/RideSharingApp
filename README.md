# RideKaro - MERN Ride Sharing App

React (Vite) + Node/Express + MongoDB. Pura flow: Splash -> OTP Login -> Home -> Choose Ride -> Driver Found -> On the Way -> Payment -> Ride Completed + Rating -> My Rides -> Profile (Wallet, Addresses, Offers, Support).

## Pehle ye chahiye
1. **Node.js 18+** (https://nodejs.org)
2. **MongoDB** - ya to local install (https://www.mongodb.com/try/download/community) ya free MongoDB Atlas.
   Atlas use karna ho to `server/.env` me `MONGO_URI` apna connection string daal do.

## Run karna (sirf 2 command)
```bash
npm install     # root, server aur client - teeno ke packages ek saath install
npm run dev     # backend (5000) + frontend (5173) dono chalu
```
Browser me kholo: **http://localhost:5173** (mobile size me dekhne ke liye DevTools -> device toolbar).

## Login kaise kare
- Koi bhi 10 digit number daalo -> Send OTP -> **OTP: 123456** (screen par bhi dikhega).
- Ya "Continue with Google / Apple" dabao (demo login, real OAuth nahi).

## Ride demo flow
Home me "Where to?" -> jagah chuno -> ride type chuno -> Book Ride. Driver automatic assign hota hai (demo drivers pehli baar server start par seed ho jaate hain). Driver aata hai, ride chalti hai aur khud complete ho jaati hai (simulation), phir payment aur rating.

## Folder structure
```
ridekaro/
  server/   Express API (models, routes, middleware, utils/fare.js, utils/seed.js, .env)
  client/   React app (src/pages, src/components, src/context)
```

## API (short)
| Method | Route | Kaam |
|---|---|---|
| POST | /api/auth/send-otp, /verify-otp, /social | Login |
| GET/PUT | /api/auth/me | Profile |
| GET | /api/rides/places | Popular jagah |
| POST | /api/rides/estimate | Fare options |
| POST | /api/rides | Ride book |
| GET | /api/rides, /rides/active, /rides/:id | Rides list |
| PATCH | /api/rides/:id/status | on_the_way / completed |
| POST | /api/rides/:id/cancel, /pay, /rate | Cancel, Payment, Rating |
| GET/POST | /api/user/wallet, /wallet/add | Wallet |
| GET/POST/DELETE | /api/user/addresses | Saved addresses |
| GET | /api/user/offers | Offers |

## Production build
```bash
npm --prefix client run build
npm start      # Express hi React build ko http://localhost:5000 par serve karega
```

## Baad me real banane ke liye
- Real SMS OTP: `server/routes/auth.js` me MSG91/Twilio lagao aur `devOtp` response se hata do.
- Real map: client me Leaflet/Google Maps; ab SVG demo map hai (`components/MapView.jsx`).
- Real payment: Razorpay; live driver tracking: Socket.io.
- `server/.env` me `JWT_SECRET` badalna mat bhoolna.
