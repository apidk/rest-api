# REST API - Reservations & CSV Parser

## Tech Stack

- **Framework:** Express.js 5.x
- **Database:** SQLite with Sequelize ORM
- **Authentication:** JWT + bcrypt
- **Testing:** Jest + Supertest
- **File Processing:** Multer + csv-parse (streaming)
- **Code Formatting:** Prettier

## Getting Started

### Prerequisites

- Node.js v22
- npm

### Installation

```bash
# Install dependencies
npm install

# Run database migration and seed data
npm run migrate
npm run seed
```

### Running the Application

```bash
# Start the server (production)
npm start

# Server runs on http://localhost:3001
```

### Running Tests

```bash
# Run all tests
npm test
```

## Database Schema

### Amenities
```sql
CREATE TABLE amenities (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```

### Reservations
```sql
CREATE TABLE reservations (
  id INTEGER PRIMARY KEY,
  amenity_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  start_time INTEGER NOT NULL,  -- Minutes from 00:00
  end_time INTEGER NOT NULL,    -- Minutes from 00:00
  date BIGINT NOT NULL,         -- Timestamp (milliseconds)
  FOREIGN KEY (amenity_id) REFERENCES amenities(id)
);
```

### Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- Bcrypt hash
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);
```

## Testing

The project includes comprehensive E2E tests covering all endpoints:

- **Auth API:** Registration, login, validation
- **Reservations API:** Filtering, sorting, grouping
- **CSV Parser API:** File upload, parsing, authentication

## Scripts

```bash
npm start              # Start the server
npm test               # Run all tests
npm run migrate        # Run database migration
npm run seed           # Seed database with CSV data
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
```

## CI/CD

GitHub Actions pipeline automatically:
- Runs on push/PR to `main` and `develop` branches
- Tests on Node.js v22
- Runs all test suites

## Security

- **Password Hashing:** Bcrypt with 10 salt rounds
- **JWT Tokens:** 24-hour expiration
- **Protected Endpoints:** CSV parser requires authentication
- **Input Validation:** Basic validation on all endpoints

## Import Postman Collection

A Postman collection is included at `postman_collection.json` with:
- Pre-configured requests for all endpoints
- Auto-save JWT token after login
- Example request bodies and parameters

**To use:**
1. Import `postman_collection.json` into Postman
2. Start the server with `npm start`
3. Run the "Login" request to get authenticated
4. Token is automatically saved for subsequent requests

## Environment Variables

```bash
# Optional - defaults are provided
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development|test|production
```

## Data Format

### Date/Time Format
- **API Input:** Unix timestamp in seconds (e.g., `1593648000`)
- **Database Storage:** Unix timestamp in milliseconds (e.g., `1593648000000`)
- **Time Display:** HH:MM format (e.g., `05:00`)
- **Start/End Time:** Minutes from midnight (e.g., `300` = 05:00)

### CSV Format
- **Delimiter:** Semicolon (`;`)
- **Headers:** First row
- **Line Endings:** Both CRLF and LF supported
