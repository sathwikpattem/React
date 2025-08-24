# E-Commerce Project with Database

This project has been updated to use a SQL database (SQLite) instead of hardcoded arrays for storing and retrieving item data.

## Project Structure

```
e-commerce-project/
├── backend/                 # Backend API server
│   ├── server.js           # Express server with SQLite database
│   ├── package.json        # Backend dependencies
│   └── database.db         # SQLite database (created automatically)
├── src/                    # Frontend React application
│   ├── components/
│   │   ├── Shop.js         # Updated to fetch data from API
│   │   └── Shop.css        # Styles including loading/error states
│   ├── services/
│   │   └── ItemService.js  # API service layer
│   └── ...
└── package.json           # Frontend dependencies
```

## Features

- **SQLite Database**: Stores item data persistently
- **RESTful API**: Full CRUD operations for items
- **Loading States**: Shows loading indicator while fetching data
- **Error Handling**: Displays error messages if backend is unavailable
- **Service Layer**: Clean separation between UI and API calls

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Add new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

## How to Run

### 1. Start the Backend Server

```bash
cd backend
npm install  # (if not already done)
npm run dev  # or npm start
```

The backend server will start on `http://localhost:5000` and automatically:
- Create the SQLite database
- Create the items table
- Insert initial sample data

### 2. Start the Frontend (in a new terminal)

```bash
cd ..  # back to project root
npm start
```

The React app will start on `http://localhost:3000`

## Database Schema

```sql
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Initial Data

The database is seeded with the following items:
- Coffee - Small ($30)
- Coffee - Medium ($45)
- Coffee - Large ($60)
- Sandwich ($50)
- Fries ($35)
- Pizza ($120)
- Burger ($100)

## Adding New Items

You can add new items using the API endpoints. For example:

```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Tea", "price": 25, "category": "beverages"}'
```

## Troubleshooting

If you see "Failed to load items" error:
1. Make sure the backend server is running on port 5000
2. Check that there are no CORS issues
3. Verify the database was created properly

## Next Steps

- Add item management UI (add/edit/delete items from frontend)
- Implement user authentication
- Add order management
- Deploy to production with proper database
