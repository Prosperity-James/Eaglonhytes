# Instructions to Switch from Dummy Data to Real API

Once you've updated your database with the SQL scripts, you can switch your frontend to use real API calls instead of dummy data.

## Steps to Switch to Real API:

### 1. Update useLands.js Hook

Replace the current `useLands.js` file with the original API-based version, or modify the existing one:

```javascript
// In useLands.js - Remove dummy data and restore API calls

// Remove the dummyProperties array and useEffect that sets dummy data

// Restore original fetchLands function:
const fetchLands = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await api.get(endpoints.lands);
    setLands(response.data || []);
    return response.data || [];
  } catch (err) {
    setError(err.message);
    showError(`Failed to fetch lands: ${err.message}`);
    return [];
  } finally {
    setLoading(false);
  }
}, []);

// Restore original addLand, updateLand, deleteLand functions...
```

### 2. Update AdminDashboard.jsx

Make sure the AdminDashboard calls `fetchLands()` on component mount:

```javascript
// In AdminDashboard.jsx
useEffect(() => {
  if (user?.is_admin) {
    fetchLands(); // This will now fetch from your database
  }
}, [user, fetchLands]);
```

### 3. Verify API Endpoints

Make sure your API endpoints are working:

- `GET /api/lands.php` - Fetch all lands
- `POST /api/lands.php` - Create new land
- `PUT /api/lands.php?id={id}` - Update land
- `DELETE /api/lands.php?id={id}` - Delete land

### 4. Test the Integration

1. Run the SQL scripts to populate your database
2. Switch the frontend to use API calls
3. Test all CRUD operations in the admin dashboard
4. Verify the lands page shows the same data

## Database Schema Notes

The SQL scripts assume your `lands` table has these columns:
- `id` (Primary Key, Auto Increment)
- `title` (VARCHAR)
- `description` (TEXT)
- `address`, `city`, `state` (VARCHAR)
- `rent_price` (DECIMAL)
- `rental_period` (VARCHAR)
- `size` (VARCHAR)
- `bedrooms`, `bathrooms` (INT/DECIMAL)
- `status` (ENUM: 'available', 'sold', 'pending')
- `amenities` (TEXT - comma separated)
- `available_date` (DATE)
- `pet_policy`, `parking` (VARCHAR)
- `images` (TEXT - comma separated URLs)
- `created_at`, `updated_at` (TIMESTAMP)

Adjust the SQL scripts if your table structure is different.
