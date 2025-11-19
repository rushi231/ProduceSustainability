# Produce Sustainability - Supermarket Sales Prediction

A machine learning web application that forecasts supermarket sales trends to enable data-driven inventory management and reduce food waste in the retail industry.

## Project Overview

Built as a collaborative team project (Team of 4), this application helps supermarkets predict sales patterns and make informed business decisions. By analyzing historical sales data using machine learning algorithms, the system provides accurate forecasts that enable better inventory planning, reduce waste, and improve business strategy.

## Technologies Used

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database for historical sales data

### Frontend
- **JavaScript** - Client-side functionality
- **HTML/CSS** - User interface structure and styling
- **Chart.js** - Interactive data visualization

### Machine Learning
- **Python** - Model training and predictions


## Features

- **Real-Time Predictions:** Machine learning models forecast sales trends in real-time
- **RESTful API:** Endpoints for model training, data processing, and serving predictions
- **Interactive Visualizations:** Chart.js dashboards displaying sales trends and forecasts
- **Time-Series Analysis:** Weekly averages and multi-store sales aggregations
- **Database Migrations:** Structured schema management for historical sales data
- **Multi-Store Support:** Compare and analyze sales across different store locations



## Getting Started

### Prerequisites
```bash
Node.js >= 14.x
PostgreSQL >= 12.x
Python >= 3.8
npm or yarn
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/rushi231/ProduceSustainability.git
cd ProduceSustainability
```

2. Install dependencies
```bash
npm install
```

3. Set up PostgreSQL database
```bash
# Create database
createdb produce_sustainability

# Run migrations
npm run migrate
```

4. Configure environment variables
```bash
# Create .env file
cp .env.example .env

# Edit .env with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=produce_sustainability
DB_USER=your_username
DB_PASSWORD=your_password
```

5. Start the development server
```bash
npm run dev
```

6. Access the application
```
http://localhost:3000
```

