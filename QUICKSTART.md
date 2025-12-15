# Quick Start Guide

Get the Produce Sustainability app running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need v14+)
node --version

# Check PostgreSQL (need v12+)
psql --version

# Check npm
npm --version
```

If missing, install:
- **Node.js**: https://nodejs.org/
- **PostgreSQL**: https://www.postgresql.org/download/

---

## Setup Steps

### 1. Install Dependencies

```bash
cd produce-sustainability
npm install
```

### 2. Setup Database

**Option A: Using psql command line**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE produce_sustainability;"
```

**Option B: Using PostgreSQL GUI (pgAdmin)**
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name it "produce_sustainability"
4. Click Save

### 3. Configure Database Connection (30 seconds)

Edit `knexfile.js` - update these lines if needed:
```javascript
user: 'postgres',      // Your PostgreSQL username
password: 'postgres',  // Your PostgreSQL password
```

### 4. Run Migrations 

```bash
npm run migrate
```

You should see:
```
Batch 1 run: 1 migrations
```

### 5. Start the Server 

```bash
npm start
```


### 6. Open in Browser

Navigate to: **http://localhost:3000**

---



## Try It Out

1. Enter store information:
   - Store: "Fresh Mart"
   - Location: "Downtown"
   - Product: "Apples"

2. Add some sample data:
   - Week 1: 10 units
   - Week 2: 12 units
   - Week 3: 15 units
   - Week 4: 18 units

3. Click **"Predict Demand"**

4. See predictions for weeks 5 and 6! 📈

---

