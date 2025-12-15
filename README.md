# Produce Sustainability Web App

A web application that uses machine learning to predict produce sales and help grocery stores minimize food waste.

## Features

- 📊 **Smart Predictions**: Uses polynomial regression to forecast future sales
- 🎯 **Reduce Waste**: Helps stores order the right amount of produce
- 📈 **Visual Analytics**: Interactive charts showing sales trends and predictions
- 💾 **Data Storage**: PostgreSQL database for long-term trend analysis
- ✨ **User-Friendly**: Simple interface for entering sales data

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Knex.js
- **Machine Learning**: Custom gradient descent implementation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd produce-sustainability
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up PostgreSQL database

First, make sure PostgreSQL is installed and running.

**Create the database:**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE produce_sustainability;

# Exit
\q
```

### 4. Configure database connection

Edit `knexfile.js` and update the database credentials:
```javascript
development: {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    database: 'produce_sustainability',
    user: 'your_username',      // Change this
    password: 'your_password',  // Change this
    charset: 'utf8'
  },
  // ...
}
```

### 5. Run database migrations
```bash
npm run migrate
```

### 6. Start the server
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### 7. Access the application

Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Making Predictions

1. **Enter Store Information**
   - Fill in store name, location, and product name

2. **Add Historical Data**
   - Click "Add Week" to add more weeks
   - Enter the number of units sold each week

3. **Generate Predictions**
   - Click "Predict Demand" to train the model
   - View predictions for the next 2 weeks

4. **Analyze Results**
   - Review the chart showing actual vs predicted sales
   - Use predictions to optimize inventory ordering

### API Endpoints

#### Train ML Model
```bash
POST /pred
Content-Type: application/json

{
  "data": {
    "X": [[0,0,0], [1,1,1], [2,4,8]],
    "y": [10, 12, 15]
  }
}
```

#### Save Sales Data
```bash
POST /save-sales
Content-Type: application/json

{
  "storeName": "Fresh Mart",
  "storeLocation": "Downtown",
  "itemName": "Apples",
  "quantitySold": 50,
  "priceSold": 2.99
}
```

#### Get Sales History
```bash
GET /sales-history?storeName=Fresh%20Mart&storeLocation=Downtown&itemName=Apples
```

#### Get Weekly Statistics
```bash
GET /weekly-stats?storeName=Fresh%20Mart&storeLocation=Downtown&daysBack=7
```

## Project Structure

```
produce-sustainability/
├── server.js                 # Express server
├── regression.js             # ML model implementation
├── SupermarketService.js     # Database service layer
├── db.js                     # Database connection
├── knexfile.js              # Knex configuration
├── package.json             # Dependencies
├── knex/
│   └── migrations/          # Database migrations
└── public/
    ├── index.html           # Main HTML file
    ├── app.js               # Frontend JavaScript
    ├── style.css            # Styles
    └── pictures/            # Images
```

## Machine Learning Model

The app uses **polynomial regression** with gradient descent:

- **Features**: Week number, week², week³
- **Algorithm**: Gradient descent with adaptive learning rate
- **Regularization**: L2 regularization to prevent overfitting
- **Prediction**: Forecasts 2 weeks ahead based on historical data

### How it works:

1. User enters historical sales data (units sold per week)
2. Data is transformed into polynomial features [week, week², week³]
3. Model is trained using gradient descent to minimize cost function
4. Trained model predicts future sales
5. Predictions help optimize inventory ordering

## Improvements Made

### Code Quality
- ✅ Fixed module export typo in `SupermarketService.js`
- ✅ Added proper error handling throughout
- ✅ Improved input validation
- ✅ Added JSDoc comments
- ✅ Used consistent `const/let` instead of `var`

### Features
- ✅ Add/remove week functionality
- ✅ Clear all data button
- ✅ Input validation with error messages
- ✅ Improved chart styling
- ✅ Store information form
- ✅ Features showcase section
- ✅ Better responsive design
- ✅ Database integration

### User Experience
- ✅ Better visual feedback
- ✅ Loading states
- ✅ Error messages
- ✅ Cleaner UI design
- ✅ Mobile-responsive layout

## Future Enhancements

- 🔄 User authentication
- 📧 Email notifications for low stock alerts
- 📊 Multiple product tracking
- 🤖 Advanced ML models (LSTM, Prophet)
- 📱 Mobile app
- 🌐 Multi-language support
- 📈 More detailed analytics dashboard

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start
```

### Port Already in Use
Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change to 3001 or another port
```

### Migration Errors
```bash
# Rollback last migration
npm run rollback

# Run migrations again
npm run migrate
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contact

For questions or support, please open an issue on GitHub.

---

**Happy predicting! Let's reduce food waste together! 🌱**
