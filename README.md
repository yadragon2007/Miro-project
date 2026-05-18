# Miro

Hotel booking platform backend REST API built with Node.js, Express, and MongoDB.

## Tech Stack

| Category     | Technology                                               |
| ------------ | -------------------------------------------------------- |
| Runtime      | Node.js (ES Modules)                                     |
| Framework    | Express 4.19                                             |
| Database     | MongoDB + Mongoose 8.3                                   |
| Auth         | bcrypt, JWT, express-session                             |
| Validation   | express-validator 7.0                                    |
| File Upload  | Multer                                                   |
| Email        | Nodemailer (Gmail SMTP)                                  |
| External API | ExchangeRate-API (via axios)                             |
| Security     | helmet, cors, express-mongo-sanitize, express-rate-limit |
| Dev          | Nodemon, dotenv                                          |

## Features

- User registration, login, and account activation via email
- Role-Based Access Control (Owner, Employee, User roles)
- Hotel CRUD with images (main + gallery), rooms, meals, and free features
- Promo code management with targeting (hotels/users) and expiration
- Currency management with ExchangeRate-API integration
- Booking/ticket system
- Rate limiting on auth and sensitive endpoints
- Global error handling with standardized error codes

## Prerequisites

- Node.js 18+
- MongoDB instance (local or remote)
- ExchangeRate-API key (free tier available at https://exchangerate-api.com)
- Gmail account with app password (for activation emails)

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):

| Variable                 | Description                            | Default                                       |
| ------------------------ | -------------------------------------- | --------------------------------------------- |
| `EMAIL`                  | Gmail SMTP email for activation emails | —                                             |
| `PASSWORD`               | Gmail SMTP app password                | —                                             |
| `OWNER_ACCOUNT_EMAIL`    | Default owner account email            | —                                             |
| `OWNER_ACCOUNT_PASSWORD` | Default owner account password         | —                                             |
| `JWT_SECRET_KEY`         | JWT signing secret                     | —                                             |
| `JWT_EXPIRE`             | JWT expiration duration                | `30d`                                         |
| `ACTIVATION_SECRET`      | Activation link signing secret         | —                                             |
| `ACTIVATION_EXPIRE`      | Activation link expiration             | `10m`                                         |
| `EXCHANGE_API_KEY`       | ExchangeRate-API key                   | —                                             |
| `SESSION_SECRET`         | Express session secret                 | —                                             |
| `SESSION_SECURE`         | Cookie secure flag                     | `false`                                       |
| `ALLOWED_ORIGINS`        | CORS origins (comma-separated)         | `http://localhost:8080,http://localhost:3000` |
| `MONGODB_URI`            | MongoDB connection string              | `mongodb://localhost:27017/miroProject`       |
| `PORT`                   | Server port                            | `8080`                                        |

## Installation

```bash
git clone <repo-url>
cd miroproject
npm install
```

Copy `.env.example` to `.env` and fill in the required values, then ensure MongoDB is running.

## Running

```bash
npm start
```

Starts the server with Nodemon (auto-restarts on file changes). Default: `http://localhost:8080`.

## Testing

```bash
npm test
```

Uses Node.js built-in test runner (`node:test`). Contains 20 security regression tests.

## API Reference

All routes are prefixed with `/api`. Optional body fields are marked with `// optional`.

### Accounts {#accounts}

#### `POST /api/accounts/` {#post-accounts}
- **Description:** Create a new user account
- **Access:** Public (rate limited: 3/hour)
- **Headers:** —
- **Body:**
```json
{
  "fullName": "yousef amr",
  "email": "yousef6448a@gmail.com",
  "password": "$Ffdsr23rewrfdfs$#",
  "location": {
    "latitude": "30.044420",
    "longitude": "31.235712",
    "country": "egypt",
    "governorate": "cairo"
  }
}
```
- **Response:** `201`
```json
{
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "fullName": "yousef amr",
    "email": "yousef6448a@gmail.com",
    "role": "664f1a2b3c4d5e6f7a8b9c0d",
    "activation": false,
    "location": {
      "latitude": "30.044420",
      "longitude": "31.235712",
      "country": "egypt",
      "governorate": "cairo"
    }
  },
  "Token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### `POST /api/accounts/login` {#post-accounts-login}
- **Description:** Authenticate user and return JWT token
- **Access:** Public (rate limited: 10/15min)
- **Headers:** —
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```
- **Response:** `200`
```json
{
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "664f1a2b3c4d5e6f7a8b9c0d",
    "activation": true,
    "location": "New York"
  },
  "Token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### `GET /api/accounts/users`
- **Description:** Get all user accounts
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Query:**
```
?name=John&email=john@example.com
```
- **Response:** `200`
```json
[
  {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "664f1a2b3c4d5e6f7a8b9c0d",
    "activation": true,
    "location": "New York"
  }
]
```

#### `POST /api/accounts/user`
- **Description:** Get a specific user by ID
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "userId": "664f1a2b3c4d5e6f7a8b9c0d"
}
```
- **Response:** `200`
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "664f1a2b3c4d5e6f7a8b9c0d",
  "activation": true,
  "location": "New York"
}
```

#### `PATCH /api/accounts/changePassword/admin` {#patch-accounts-changepassword-admin}
- **Description:** Change any user's password (by admin)
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "id": "664f1a2b3c4d5e6f7a8b9c0d",
  "password": "newPassword123"
}
```
- **Response:** `200`
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "664f1a2b3c4d5e6f7a8b9c0d",
  "activation": true,
  "location": "New York"
}
```

#### `PATCH /api/accounts/changePassword/` {#patch-accounts-changepassword}
- **Description:** Change own password (requires current password)
- **Access:** Private (User, rate limited: 5/15min)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "oldPassword": "currentPass123",
  "newPassword": "newPass456",
  "confirmPassword": "newPass456"
}
```
- **Response:** `200`
```
password updated successfully
```

#### `PUT /api/accounts/`
- **Description:** Update own profile (name, email, location)
- **Access:** Private (User)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "fullName": "John Updated", // optional
  "email": "john.new@example.com", // optional
  "location": "Los Angeles" // optional
}
```
- **Response:** `200`
```json
{
  "message": "userData updated successflly",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "fullName": "John Updated",
    "email": "john.new@example.com",
    "role": "664f1a2b3c4d5e6f7a8b9c0d",
    "activation": true,
    "location": "Los Angeles"
  }
}
```

#### `DELETE /api/accounts/`
- **Description:** Delete own account
- **Access:** Private (User)
- **Headers:** `Authorization: Bearer <token>`
- **Body:** —
- **Response:** `200`
```
account removed
```

### Activation {#activation}

#### `POST /api/activation/` {#post-activation}
- **Description:** Request account activation email (sends link via Gmail SMTP)
- **Access:** Private (User, rate limited: 5/15min)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "userId": "664f1a2b3c4d5e6f7a8b9c0d"
}
```
- **Response:** `200`
```
email has been sent successflly. link expires in 10m
```

#### `GET /api/activation/:id/:token` {#get-activation-id-token}
- **Description:** Verify activation link and activate account
- **Access:** Public
- **Headers:** —
- **Params:** `id` (user ID), `token` (JWT from email)
- **Response:** `200`
```json
{
  "message": "account has been activated successflly",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "fullName": "John Doe",
    "email": "john@example.com",
    "activation": true
  }
}
```

### Hotels {#hotels}

#### `POST /api/hotel/` {#post-hotel}
- **Description:** Create a new hotel with rooms, meals, features, and images
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "hotel": {
    "name": "Grand Palace Hotel",
    "description": "A luxurious 5-star hotel in the city center",
    "stars": 5,
    "phone": "+1-555-0100",
    "currency": "USD",
    "location": {
      "address": "123 Main St",
      "city": "New York",
      "country": "USA"
    },
    "rooms": [ // optional
      {
        "name": "Deluxe Suite",
        "price": 250,
        "numberOfRooms": 10
      }
    ],
    "meals": [ // optional
      {
        "name": "Breakfast",
        "price": 25
      }
    ],
    "freeFeatures": ["WiFi", "Pool"], // optional
    "images": { // optional
      "mainImage": ["main.jpg"],
      "gallery": ["img1.jpg", "img2.jpg"]
    }
  }
}
```
- **Response:** `201`
```
hotel added successfully
```

#### `GET /api/hotel/`
- **Description:** Get all hotels with optional filters
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Query:**
```
?name=Grand&stars=5&currency=USD
```
- **Response:** `200`
```json
[
  {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "name": "Grand Palace Hotel",
    "description": "A luxurious 5-star hotel in the city center",
    "stars": 5,
    "phone": "+1-555-0100",
    "currency": "USD",
    "location": { "address": "123 Main St", "city": "New York", "country": "USA" },
    "rooms": [],
    "meals": [],
    "freeFeatures": ["WiFi", "Pool"],
    "images": {}
  }
]
```

#### `POST /api/hotel/get` {#post-hotel-get}
- **Description:** Get a specific hotel by ID and/or name
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "id": "664f1a2b3c4d5e6f7a8b9c0d", // optional
  "name": "Grand Palace Hotel" // optional
}
```
- **Response:** `200`
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "name": "Grand Palace Hotel",
  "description": "A luxurious 5-star hotel in the city center",
  "stars": 5,
  "rooms": [],
  "meals": [],
  "freeFeatures": ["WiFi", "Pool"],
  "images": {
    "mainImage": ["main.jpg"],
    "gallery": ["img1.jpg"]
  }
}
```

#### `PUT /api/hotel/`
- **Description:** Update hotel information (name, description, stars, location, phone)
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "hotelId": "664f1a2b3c4d5e6f7a8b9c0d",
  "name": "Grand Palace Hotel Updated", // optional
  "description": "Updated description", // optional
  "stars": 4, // optional
  "location": { // optional
    "address": "456 Oak Ave"
  },
  "phone": "+1-555-0101" // optional
}
```
- **Response:** `200`
```
hotel updated successfully
```

#### `DELETE /api/hotel/`
- **Description:** Delete a hotel by ID (header)
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`, `id` (hotel ID)
- **Body:** —
- **Response:** `200`
```
hotel deleted successfully
```

#### `PATCH /api/hotel/images`
- **Description:** Upload images (main + gallery) to a hotel
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`, `hotelid`
- **Body:** Multipart form data:
  - `mainImage` — file (max 1)
  - `gallery` — files (max 10)
- **Response:** `200`
```json
{ "msg": "images added successfully" }
```

#### `DELETE /api/hotel/images`
- **Description:** Delete specific images from a hotel
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "deletedImages": [{ "imageName": "img1.jpg", "imageFolder": "gallery" }],
  "hotelId": "664f1a2b3c4d5e6f7a8b9c0d"
}
```
- **Response:** `200`
```
images deleted successfully
```

#### `PATCH /api/hotel/data`
- **Description:** Add features, meals, or rooms to a hotel
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "hotelId": "664f1a2b3c4d5e6f7a8b9c0d",
  "freeFeatures": ["Spa", "Gym"], // optional
  "meals": [ // optional
    {
      "name": "Dinner",
      "price": 50
    }
  ],
  "rooms": [ // optional
    {
      "name": "Presidential Suite",
      "price": 500,
      "numberOfRooms": 5
    }
  ]
}
```
- **Response:** `200`
```
data added successfully [freeFeatures,meals,rooms]
```

#### `DELETE /api/hotel/data`
- **Description:** Remove features, meals, or rooms from a hotel by name
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "hotelId": "664f1a2b3c4d5e6f7a8b9c0d",
  "freeFeatures": ["Pool"], // optional
  "meals": [{ "name": "Breakfast" }], // optional
  "rooms": [{ "name": "Deluxe Suite" }] // optional
}
```
- **Response:** `200`
```
data deleted successfully [freeFeatures,meals,rooms]
```

#### `PATCH /api/hotel/modify`
- **Description:** Modify existing hotel data fields (e.g. update room price)
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "hotelId": "664f1a2b3c4d5e6f7a8b9c0d",
  "rooms": [ // optional
    {
      "name": "Deluxe Suite",
      "newData": {
        "price": 300,
        "numberOfRooms": 15
      }
    }
  ],
  "meals": [ // optional
    {
      "name": "Breakfast",
      "newData": {
        "price": 30
      }
    }
  ]
}
```
- **Response:** `200`
```
data modified successfully [rooms,meals]
```

### Promo Codes {#promocodes}

#### `POST /api/promoCode/`
- **Description:** Create a new promo code with offer and targeting rules
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "code": "SUMMER20",
  "expirationDate": {
    "year": 2025,
    "month": 12,
    "day": 31
  },
  "offer": {
    "type": "percentage",
    "value": 20
  },
  "forAllHotels": true, // optional
  "Hotels": ["664f1a2b3c4d5e6f7a8b9c0d"], // optional
  "forAllUsers": true, // optional
  "users": ["664f1a2b3c4d5e6f7a8b9c0d"], // optional
  "usedOneTimeOfUser": false, // optional
  "infintyTimesToUse": true, // optional
  "howManyToUse": 100 // optional
}
```
- **Response:** `201`
```json
{
  "msg": "promoCode add successfully",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "code": "SUMMER20",
    "expirationDate": "2025-12-31T00:00:00.000Z",
    "offer": { "type": "percentage", "value": 20 },
    "forAllHotels": true,
    "forAllUsers": true
  }
}
```

#### `GET /api/promoCode/`
- **Description:** Get all promo codes with optional filters
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Query:**
```
?code=SUMMER20&forAllHotels=true&forAllUsers=false
```
- **Response:** `200`
```json
{
  "msg": "promoCodes have been got successfully",
  "data": [
    {
      "_id": "664f1a2b3c4d5e6f7a8b9c0d",
      "code": "SUMMER20",
      "expirationDate": "2025-12-31T00:00:00.000Z",
      "offer": { "type": "percentage", "value": 20 }
    }
  ]
}
```

#### `POST /api/promoCode/get`
- **Description:** Get a promo code by ID
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "promoCodeId": "664f1a2b3c4d5e6f7a8b9c0d"
}
```
- **Response:** `200`
```json
{
  "msg": "promoCode has been got successfully",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "code": "SUMMER20",
    "expirationDate": "2025-12-31T00:00:00.000Z",
    "offer": { "type": "percentage", "value": 20 }
  }
}
```

#### `PUT /api/promoCode/`
- **Description:** Update an existing promo code
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "promoCodeId": "664f1a2b3c4d5e6f7a8b9c0d",
  "expirationDate": { "year": 2025, "month": 6, "day": 30 }, // optional
  "forAllHotels": false, // optional
  "acceptedHotels": ["664f1a2b3c4d5e6f7a8b9c0d"], // optional
  "forAllUsers": true, // optional
  "users": [], // optional
  "usedOneTimeOfUser": true, // optional
  "offer": { "type": "flat", "value": 50 }, // optional
  "infintyTimesToUse": false, // optional
  "howManyToUse": 50 // optional
}
```
- **Response:** `200`
```json
{
  "msg": "promoCode updated successfully",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "code": "SUMMER20",
    "offer": { "type": "flat", "value": 50 }
  }
}
```

#### `DELETE /api/promoCode/`
- **Description:** Delete a promo code by ID
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "promoCodeId": "664f1a2b3c4d5e6f7a8b9c0d"
}
```
- **Response:** `200`
```json
{
  "msg": "promoCode deleted successfully"
}
```

### Currency {#currency}

#### `POST /api/currency/`
- **Description:** Add a new currency with formatting options
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currencyCode": "USD",
  "symbol": "$",
  "thousands_separator": ",",
  "decimal_separator": "."
}
```
- **Response:** `201`
```json
{
  "msg": "currency added succefully",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "currencyCode": "USD",
    "symbol": "$",
    "thousands_separator": ",",
    "decimal_separator": "."
  }
}
```

#### `POST /api/currency/get`
- **Description:** Get a specific currency by code or ID
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currencyCode": "USD" // optional
}
```
or
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d" // optional
}
```
- **Response:** `200`
```json
{
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "currencyCode": "USD",
    "symbol": "$"
  }
}
```

#### `GET /api/currency/`
- **Description:** Get all currencies with optional filters
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Query:**
```
?currencyCode=USD&symbol=$
```
- **Response:** `200`
```json
{
  "data": [
    {
      "_id": "664f1a2b3c4d5e6f7a8b9c0d",
      "currencyCode": "USD",
      "symbol": "$",
      "thousands_separator": ",",
      "decimal_separator": "."
    }
  ]
}
```

#### `PUT /api/currency/`
- **Description:** Update a currency's formatting options
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currencyId": "664f1a2b3c4d5e6f7a8b9c0d",
  "currencyCode": "EUR", // optional
  "symbol": "€", // optional
  "thousands_separator": ".", // optional
  "decimal_separator": "," // optional
}
```
- **Response:** `200`
```json
{
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "currencyCode": "EUR",
    "symbol": "€",
    "thousands_separator": ".",
    "decimal_separator": ","
  }
}
```

#### `DELETE /api/currency/`
- **Description:** Delete a currency by ID
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currencyId": "664f1a2b3c4d5e6f7a8b9c0d"
}
```
- **Response:** `200`
```json
{
  "msg": "currency deleted succefully"
}
```

#### `GET /api/currency/api/getAllCurrenciesCodes`
- **Description:** Get all supported currency codes from ExchangeRate-API
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:** —
- **Response:** `200`
```json
{
  "supportedCodes": [
    { "code": "USD", "name": "United States Dollar" },
    { "code": "EUR", "name": "Euro" }
  ]
}
```

#### `GET /api/currency/api/conversionCurrency/:base/:target/:amount`
- **Description:** Convert an amount from one currency to another via ExchangeRate-API
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Params:** `base` (e.g. USD), `target` (e.g. EUR), `amount` (e.g. 100)
- **Response:** `200`
```json
{
  "conversionCurrency": {
    "base": "USD",
    "target": "EUR",
    "amount": 100,
    "result": 92.5
  }
}
```

### Owner {#owner}

#### `POST /api/owner/login` {#post-owner-login}
- **Description:** Authenticate as owner and return JWT token
- **Access:** Public (rate limited: 10/15min)
- **Headers:** —
- **Body:**
```json
{
  "email": "owner@example.com",
  "password": "ownerPass123"
}
```
- **Response:** `200`
```json
{
  "msg": "loged in successfully",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "fullName": "Owner",
    "email": "owner@example.com",
    "role": {
      "_id": "664f1a2b3c4d5e6f7a8b9c0d",
      "roleName": "owner",
      "fullAccess": true
    }
  },
  "Token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### `PATCH /api/owner/password/change` {#patch-owner-password-change}
- **Description:** Change owner's password (requires current password)
- **Access:** Private (Admin, rate limited: 5/15min)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "oldPassword": "currentPass123",
  "newPassword": "newPass456",
  "confirmPassword": "newPass456"
}
```
- **Response:** `200`
```json
{
  "msg": "password changed successfully"
}
```

#### `PUT /api/owner/`
- **Description:** Update owner's name and/or email
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "fullName": "Owner Updated", // optional
  "email": "owner.new@example.com" // optional
}
```
- **Response:** `200`
```json
{
  "msg": "owner updated successfully successfully",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "fullName": "Owner Updated",
    "email": "owner.new@example.com"
  }
}
```

#### `DELETE /api/owner/` {#delete-owner}
- **Description:** Delete owner account (requires password confirmation)
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "password": "ownerPass123"
}
```
- **Response:** `200`
```json
{
  "msg": "owner deleted successfully"
}
```

### Roles {#roles}

#### `POST /api/role/`
- **Description:** Create a new role with optional permissions
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "roleName": "manager",
  "description": "Hotel manager role",
  "permissions": ["/api/hotel", "/api/ticket"] // optional
}
```
- **Response:** `201`
```json
{
  "message": "Role added successfully"
}
```

#### `GET /api/role/`
- **Description:** Get all roles
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:** —
- **Response:** `200`
```json
[
  {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "roleName": "manager",
    "description": "Hotel manager role",
    "fullAccess": false,
    "permissions": ["/api/hotel", "/api/ticket"]
  }
]
```

#### `POST /api/role/get`
- **Description:** Get a role by name or ID
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "roleName": "manager" // optional
}
```
or
```json
{
  "roleId": "664f1a2b3c4d5e6f7a8b9c0d" // optional
}
```
- **Response:** `200`
```json
{
  "_id": "664f1a2b3c4d5e6f7a8b9c0d",
  "roleName": "manager",
  "description": "Hotel manager role",
  "fullAccess": false,
  "permissions": ["/api/hotel", "/api/ticket"]
}
```

#### `PUT /api/role/`
- **Description:** Update a role's name, description, or permissions
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "roleId": "664f1a2b3c4d5e6f7a8b9c0d",
  "roleName": "senior-manager", // optional
  "description": "Senior manager", // optional
  "permissions": ["/api/hotel", "/api/employee", "/api/ticket"] // optional
}
```
- **Response:** `200`
```json
{
  "message": "Role updated successfully",
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "roleName": "senior-manager",
    "description": "Senior manager",
    "fullAccess": false,
    "permissions": ["/api/hotel", "/api/employee", "/api/ticket"]
  }
}
```

#### `DELETE /api/role/`
- **Description:** Delete a role by ID or name
- **Access:** Private (Admin)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "roleId": "664f1a2b3c4d5e6f7a8b9c0d" // optional
}
```
or
```json
{
  "roleName": "manager" // optional
}
```
- **Response:** `200`
```json
{
  "message": "Role deleted successfully"
}
```

### Employees {#employees}

#### `POST /api/employee/login` {#post-employee-login}
- **Description:** Authenticate as employee and return JWT token
- **Access:** Public (rate limited: 10/15min)
- **Headers:** —
- **Body:**
```json
{
  "email": "jane@example.com",
  "password": "empPass123"
}
```
- **Response:** `200`
```json
{
  "employee": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "role": "664f1a2b3c4d5e6f7a8b9c0d"
  },
  "Token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Tickets {#tickets}

#### `POST /api/ticket/` {#post-ticket}
- **Description:** Book a hotel room (calculate dates, meals, and promo — partial implementation)
- **Access:** Private (User)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "hotelId": "664f1a2b3c4d5e6f7a8b9c0d",
  "roomName": "Deluxe Suite",
  "promoCode": "SUMMER20", // optional
  "checkInDate": { "year": 2025, "month": 6, "day": 15 },
  "checkOutDate": { "year": 2025, "month": 6, "day": 20 },
  "adults": 2,
  "children": 1, // optional
  "meals": ["Breakfast", "Dinner"], // optional
  "moreDetails": "Extra pillow please" // optional
}
```
- **Response:** *Not implemented* (controller currently only logs meal data)

## User Roles

| Role         | Access                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| **Owner**    | Full access to all endpoints. Created automatically on first run if no owner exists.                   |
| **Employee** | Admin with role-based permissions. Permissions are checked against `req.baseUrl` (e.g., `/api/hotel`). |
| **User**     | End customer. Can manage own profile, book tickets, and activate account via email.                    |

## Project Structure

```
miroproject/
├── app.js                  # Express app entry point
├── config/                 # Database and env configuration
├── controllers/            # Route handlers (9 controllers)
├── middleware/             # Auth, authorization, error handler, rate limiters
├── models/                 # Mongoose schemas (7 models)
├── routers/                # Express route definitions
├── services/               # Data access layer and external API integration
├── utils/                  # AppError, asyncHandler, startup seeding
├── validator/              # express-validator chains (9 validators)
├── public/uploads/hotels/  # Hotel image uploads
└── test/                   # Security regression tests
```

## Security

- **Rate Limiting**: 3 tiers — auth (10/15min), sensitive (5/15min), account creation (3/hour)
- **JWT + bcrypt**: Passwords hashed with bcrypt; JWT tokens for session management
- **Password Field Protection**: `select: false` on all password model fields
- **No Raw Error Leaks**: Global error handler strips stack traces in production
- **Input Sanitization**: `express-mongo-sanitize` prevents NoSQL injection
- **Path Traversal Prevention**: Image filenames validated with strict regex
- **CORS**: Configurable allowed origins
- **Helmet**: Security headers (CSP configured)
- **Body Whitelisting**: Controllers destructure `req.body` instead of passing it directly to queries

## Error Codes

All error responses include a 4-digit code. Codes are grouped by feature area.

### 00xx — Global / System Errors

| Code | HTTP | Description | Endpoints |
|---|---|---|---|
| `0000` | 500 | Generic server error (fallback when no specific code) | Any endpoint |
| `0001` | 400 | Mongoose validation error (schema-level validation failed) | Any endpoint |
| `0002` | 400 | Invalid MongoDB ID format (CastError) | Any endpoint using ID params |
| `0003` | 409 | Duplicate field value (unique constraint, MongoDB code 11000) | Any endpoint creating/updating records |
| `0004` | 401 | Invalid JWT token (JsonWebTokenError) | Any protected endpoint |
| `0005` | 401 | Expired JWT token (TokenExpiredError) | Any protected endpoint |
| `0006` | 404 | Route not found | Any undefined URL |

### 01xx — Authentication Errors

| Code | HTTP | Description | Endpoints |
|---|---|---|---|
| `0100` | 400 | Invalid credentials (Owner) | [`POST /api/owner/login`](#post-owner-login) |
| `0101` | 401 | Invalid credentials (Employee) | [`POST /api/employee/login`](#post-employee-login) |
| `0102` | 401 | Invalid credentials (User) | [`POST /api/accounts/login`](#post-accounts-login) |

### 02xx — Authorization / JWT Errors

| Code | HTTP | Description | Endpoints |
|---|---|---|---|
| `0200` | 403 | Missing `Authorization: Bearer <token>` header (Admin) | [All Admin-protected endpoints](#accounts) |
| `0201` | 403 | JWT title is not "Owner" or "Employee" | [All Admin-protected endpoints](#accounts) |
| `0202` | 403 | Admin user no longer exists in database | [All Admin-protected endpoints](#accounts) |
| `0203` | 403 | Password was changed after token was issued (Admin) | [All Admin-protected endpoints](#accounts) |
| `0204` | 403 | User does not have RBAC permission for this URL | [All Admin-protected endpoints](#accounts) |
| `0210` | 401 | Missing `Authorization: Bearer <token>` header (User) | [All User-protected endpoints](#accounts) |
| `0211` | 401 | User no longer exists in database | [All User-protected endpoints](#accounts) |
| `0212` | 403 | Password was changed after token was issued (User) | [All User-protected endpoints](#accounts) |
| `0220` | 401 | Activation token is undefined | [`GET /api/activation/:id/:token`](#get-activation-id-token) |
| `0221` | 401 | Activation URL is invalid (ID mismatch) | [`GET /api/activation/:id/:token`](#get-activation-id-token) |
| `0222` | 401 | User in activation link does not exist | [`GET /api/activation/:id/:token`](#get-activation-id-token) |
| `0223` | 403 | Password was changed after activation URL was sent | [`GET /api/activation/:id/:token`](#get-activation-id-token) |

### 03xx — Account Operations Errors

| Code | HTTP | Description | Endpoints |
|---|---|---|---|
| `0300` | 404 | User not found (admin password change target) | [`PATCH /api/accounts/changePassword/admin`](#patch-accounts-changepassword-admin) |
| `0301` | 400 | New password and confirm password do not match | [`PATCH /api/accounts/changePassword/`](#patch-accounts-changepassword) |
| `0302` | 400 | Old password is incorrect | [`PATCH /api/accounts/changePassword/`](#patch-accounts-changepassword) |

### 04xx — Activation Errors

| Code | HTTP | Description | Endpoints |
|---|---|---|---|
| `0400` | 403 | Logged-in user ID does not match the requested activation user ID | [`POST /api/activation/`](#post-activation) |

### 05xx — Hotel Errors

| Code | HTTP | Description | Endpoints |
|---|---|---|---|
| `0500` | 400 | No hotel found with the given ID and name combination | [`POST /api/hotel/get`](#post-hotel-get) |
| `0501` | 500 | Failed to create hotel folders on disk | [`POST /api/hotel/`](#post-hotel) |

### 08xx — Owner Errors

| Code | HTTP | Description | Endpoints |
|---|---|---|---|
| `0800` | 400 | Old password is incorrect | [`PATCH /api/owner/password/change`](#patch-owner-password-change) |
| `0801` | 400 | New password and confirm password do not match | [`PATCH /api/owner/password/change`](#patch-owner-password-change) |
| `0802` | 400 | Password is incorrect (account deletion verification) | [`DELETE /api/owner/`](#delete-owner) |

### 12xx — Validation / Body / Date Errors

| Code | HTTP | Description | Endpoints |
|---|---|---|---|
| `1200` | 422 | Request body is empty when at least one property is required | Endpoints with `notEmpty` validation |
| `1201` | 422 | Body contains properties that are not allowed for this endpoint | All endpoints with body property whitelisting |
| `1202` | 422 | express-validator validation failed (see error message for details) | All endpoints using validators |
| `1203` | 422 | Check-in date must be in the future | [`POST /api/ticket/`](#post-ticket) |
| `1204` | 422 | Check-out date must be after check-in date | [`POST /api/ticket/`](#post-ticket) |

## Tests

20 security regression tests using `node:test`. They verify:

- Role `fullAccess` is boolean
- Password fields are hidden by default
- Authorization middleware does not write identity into `req.body`
- Promo code expiration comparison uses correct timestamp comparison
- No raw error objects leaked to clients
- `mongoSanitize` middleware is applied
- Trust proxy is enabled
- No `req.body` passed directly to database queries
- Controllers destructure `req.body`
- Image deletion validator rejects path traversal
- Activation middleware sets `req.auth`
- Global error handler is used (not inline)
- 404 handler returns JSON with code
- `AppError` formats code as 4-digit string
- Error handler includes code strings
- Authorization middleware has no try/catch blocks
