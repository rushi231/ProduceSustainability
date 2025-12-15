# Produce Sustainability Web App

A web application that uses machine learning to predict produce sales and help grocery stores minimize food waste.

## Features

- **Smart Predictions**: Uses polynomial regression to forecast future sales
- **Reduce Waste**: Helps stores order the right amount of produce
- **Visual Analytics**: Interactive charts showing sales trends and predictions
- **Data Storage**: PostgreSQL database for long-term trend analysis
- **User-Friendly**: Simple interface for entering sales data

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


```


