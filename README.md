# MSCS API
## Contributors:
### Seth Keirn and Landon Farrar

REST API for the Montana State Club Soccer web platform. Provides authentication, roster management, schedule, results, and highlights endpoints.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas or local)
- **Authentication**: JWT with bcrypt

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB instance)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mscs?retryWrites=true&w=majority
JWT_SECRET=your-long-random-secret-key-here
NODE_ENV=development
```

**Getting your MongoDB URI:**
- **Atlas (cloud)**: 
  1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
  2. Database → Connect → Drivers
  3. Copy connection string and replace `<username>` and `<password>`
- **Local**: `mongodb://127.0.0.1:27017/mscs`

**Generate a strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Seed Database (Optional)

Create test users (admin and player accounts):

```bash
npm run seed
```

**Test accounts created:**
- Admin: `admin@mscs.com` / `admin123`
- Player: `player@mscs.com` / `player123`

> ⚠️ Seed script clears existing users. Only run in development.

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server runs on `http://localhost:5000` (or the PORT specified in `.env`)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Roster
- `GET /api/roster` - Get all roster members
- `POST /api/roster` - Create roster member (admin only)
- `PUT /api/roster/:id` - Update roster member (admin only)
- `DELETE /api/roster/:id` - Delete roster member (admin only)

### Schedule
- `GET /api/schedule` - Get all games
- `POST /api/schedule` - Create game (admin only)
- `PUT /api/schedule/:id` - Update game (admin only)
- `DELETE /api/schedule/:id` - Delete game (admin only)

### Results
- `GET /api/results` - Get all results
- `POST /api/results` - Create result (admin only)
- `PUT /api/results/:id` - Update result (admin only)
- `DELETE /api/results/:id` - Delete result (admin only)

### Highlights
- `GET /api/highlights` - Get all highlights
- `POST /api/highlights` - Create highlight (admin only)
- `PUT /api/highlights/:id` - Update highlight (admin only)
- `DELETE /api/highlights/:id` - Delete highlight (admin only)

## Project Structure

```
mscs-api/
├── models/          # Mongoose schemas
├── routes/          # Express route handlers
├── middleware/      # Auth & custom middleware
├── server.js        # Main entry point
├── seed.js          # Database seeder
└── .env            # Environment variables (gitignored)
```

## Security Notes

- `.env` is gitignored - never commit secrets
- Passwords are hashed with bcrypt (salt rounds: 10)
- JWT tokens expire after 7 days
- Seed script blocked in production (NODE_ENV check)

## Troubleshooting

**MongoDB connection fails:**
- Verify `MONGO_URI` is correct
- Check Atlas IP allowlist (0.0.0.0/0 for dev, specific IPs for prod)
- Ensure database user has read/write permissions

**Port already in use:**
- Change `PORT` in `.env`
- Or kill the process: `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process`

**Seed fails:**
- Ensure `NODE_ENV=development` in `.env`
- Check MongoDB connection is active
