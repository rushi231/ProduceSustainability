const express = require("express");
const bp = require("body-parser");
const ml = require("./regression.js");
const SupermarketService = require("./SupermarketService.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bp.json({ limit: '50mb', extended: true }));
app.use(bp.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static("./public"));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

/**
 * Train ML model endpoint
 */
app.post("/pred", (req, res) => {
  try {
    const data = req.body.data;
    
    if (!data || !data.X || !data.y) {
      return res.status(400).json({ 
        error: "Missing required fields: X and y" 
      });
    }

    if (data.X.length !== data.y.length) {
      return res.status(400).json({ 
        error: "X and y must have the same length" 
      });
    }

    // train polynomial model
    console.log(`Training polynomial model with ${data.X.length} data points`);
    const polyModel = ml.gradDescent(data.X, data.y);
    
    // train linear model for comparison
    console.log("Training linear model");
    const linearModel = ml.trainLinearModel(data.X, data.y);
    
    // calculate performance metrics
    const polyR2 = ml.calculateR2Score(data.X, data.y, polyModel.weights, polyModel.bias);
    const polyMAE = ml.calculateMAE(data.X, data.y, polyModel.weights, polyModel.bias);
    const polyRMSE = ml.calculateRMSE(data.X, data.y, polyModel.weights, polyModel.bias);
    
    const linearR2 = ml.calculateR2Score(
      data.X.map(x => [x[0]]), 
      data.y, 
      linearModel.weights, 
      linearModel.bias
    );
    const linearMAE = ml.calculateMAE(
      data.X.map(x => [x[0]]), 
      data.y, 
      linearModel.weights, 
      linearModel.bias
    );
    
    res.json({
      success: true,
      polynomial: {
        weights: polyModel.weights,
        bias: polyModel.bias,
        r2Score: polyR2,
        mae: polyMAE,
        rmse: polyRMSE
      },
      linear: {
        weights: linearModel.weights,
        bias: linearModel.bias,
        r2Score: linearR2,
        mae: linearMAE
      },
      dataPoints: data.X.length,
      recommendation: polyR2 > linearR2 ? "polynomial" : "linear"
    });
  } catch (error) {
    console.error("Error in /pred:", error);
    res.status(500).json({ 
      error: "Failed to train model", 
      message: error.message 
    });
  }
});

/**
 * POST /save-sales - Save sales data to database
 * Body: { storeName, storeLocation, itemName, quantitySold, priceSold }
 */
app.post("/save-sales", async (req, res) => {
  try {
    const { storeName, storeLocation, itemName, quantitySold, priceSold } = req.body;
    
    // Validate input
    if (!storeName || !storeLocation || !itemName || !quantitySold || !priceSold) {
      return res.status(400).json({ 
        error: "Missing required fields" 
      });
    }

    await SupermarketService.saveStoresData(
      storeName, 
      storeLocation, 
      itemName, 
      parseInt(quantitySold),
      parseFloat(priceSold)
    );
    
    res.json({ 
      success: true, 
      message: "Sales data saved successfully" 
    });
  } catch (error) {
    console.error("Error in /save-sales:", error);
    res.status(500).json({ 
      error: "Failed to save sales data", 
      message: error.message 
    });
  }
});

/**
 * GET /sales-history - Get historical sales data for an item
 * Query params: storeName, storeLocation, itemName
 */
app.get("/sales-history", async (req, res) => {
  try {
    const { storeName, storeLocation, itemName } = req.query;
    
    if (!storeName || !storeLocation || !itemName) {
      return res.status(400).json({ 
        error: "Missing required query parameters" 
      });
    }

    const history = await SupermarketService.getItemSalesHistory(
      storeName, 
      storeLocation, 
      itemName
    );
    
    res.json({ 
      success: true, 
      data: history,
      count: history.length 
    });
  } catch (error) {
    console.error("Error in /sales-history:", error);
    res.status(500).json({ 
      error: "Failed to retrieve sales history", 
      message: error.message 
    });
  }
});

/**
 * GET /weekly-stats - Get weekly statistics
 * Query params: storeName, storeLocation, daysBack (optional)
 */
app.get("/weekly-stats", async (req, res) => {
  try {
    const { storeName, storeLocation, daysBack = 7 } = req.query;
    
    if (!storeName || !storeLocation) {
      return res.status(400).json({ 
        error: "Missing required query parameters" 
      });
    }

    const [weeklyAvg, totalProd] = await Promise.all([
      SupermarketService.getWeeklyAverageAllProducts(
        storeName, 
        parseInt(daysBack), 
        storeLocation
      ),
      SupermarketService.getWeeklyTotalAllProducts(
        storeName, 
        parseInt(daysBack), 
        storeLocation
      )
    ]);
    
    res.json({ 
      success: true,
      weeklyAverage: weeklyAvg, 
      weeklyTotal: totalProd 
    });
  } catch (error) {
    console.error("Error in /weekly-stats:", error);
    res.status(500).json({ 
      error: "Failed to retrieve weekly stats", 
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    error: "Internal server error", 
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.url 
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=====================================');
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
  console.log('=====================================');
});

module.exports = app;
