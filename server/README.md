# Budget Buddy Backend

This is the backend server for the Budget Buddy application, built with Node.js, Express, TypeScript, and MongoDB.

## Setup

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/budget-buddy
   NODE_ENV=development
   ```

### Running the Server

- Development mode:
  ```
  npm run dev
  ```

- Production build:
  ```
  npm run build
  npm start
  ```

## API Endpoints

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a category by ID
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Transactions

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/analytics` - Get transaction analytics
- `GET /api/transactions/:id` - Get a transaction by ID
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

## Data Models

### Category

```typescript
{
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
}
```

### Transaction

```typescript
{
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}
```

## Integration with Frontend

The frontend can connect to this backend by setting the `VITE_API_URL` environment variable to the backend URL (e.g., `http://localhost:5000/api`). The frontend includes an API client in `src/utils/api.ts` that handles all communication with the backend. 