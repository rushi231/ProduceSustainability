// ML hyperparameters
const Xsize = 3;
const alpha = 0.01;
const lambda = 1;
const steps = 1500;

/**
 * Hypothesis function for linear/polynomial regression
 */
function hypothesis(weights, bias) {
  return (x) => {
    let total = bias;
    for (let i = 0; i < weights.length; i++) {
      total += x[i] * weights[i];
    }
    return total;
  };
}

/**
 * Cost function with L2 regularization
 */
function cost(X, y, weights, bias) {
  let J = 0;
  const model = hypothesis(weights, bias);
  
  // sum of squared errors
  for (let i = 0; i < X.length; i++) {
    const error = model(X[i]) - y[i];
    J += (error * error) / X.length;
  }
  
  // regularization to prevent overfitting
  for (let j = 0; j < weights.length; j++) {
    J += lambda * (weights[j] * weights[j]) / X.length;
  }
  
  return J;
}

/**
 * Calculate gradients for gradient descent
 */
function costPrime(X, y, weights, bias) {
  const gradients = [];
  const model = hypothesis(weights, bias);
  
  // gradient for each weight
  for (let j = 0; j < weights.length; j++) {
    let grad = 0;
    for (let i = 0; i < X.length; i++) {
      grad += (model(X[i]) - y[i]) * X[i][j];
    }
    grad = grad / X.length + (lambda * weights[j]) / X.length;
    gradients.push(grad);
  }
  
  // gradient for bias (no regularization)
  let biasGrad = 0;
  for (let i = 0; i < X.length; i++) {
    biasGrad += model(X[i]) - y[i];
  }
  gradients.push(biasGrad / X.length);
  
  return gradients;
}

/**
 * Train model using gradient descent
 */
function gradDescent(X, y) {
  let learningRate = alpha;
  let weights = new Array(Xsize).fill(0);
  let bias = 0;
  
  console.log("Training model...");
  let prevCost = Infinity;
  
  for (let iteration = 0; iteration < steps; iteration++) {
    const grads = costPrime(X, y, weights, bias);
    
    // update weights
    for (let j = 0; j < grads.length - 1; j++) {
      weights[j] -= learningRate * grads[j];
    }
    bias -= learningRate * grads[grads.length - 1];
    
    // check if learning rate is too high
    const currentCost = cost(X, y, weights, bias);
    if (currentCost > prevCost) {
      learningRate /= 2;
      iteration -= steps - iteration; // retry with lower rate
      console.log("Adjusting learning rate:", learningRate);
    }
    prevCost = currentCost;
    
    if (iteration % 300 === 0) {
      console.log("Step", iteration, "Cost:", currentCost.toFixed(4));
    }
  }
  
  console.log("Training complete. Final cost:", prevCost.toFixed(4));
  return { weights, bias, finalCost: prevCost };
}

/**
 * Calculate R-squared score
 */
function calculateR2Score(X, y, weights, bias) {
  const model = hypothesis(weights, bias);
  
  // mean of actual values
  let ySum = 0;
  for (let i = 0; i < y.length; i++) {
    ySum += y[i];
  }
  const yMean = ySum / y.length;
  
  // total sum of squares
  let totalSS = 0;
  for (let i = 0; i < y.length; i++) {
    const diff = y[i] - yMean;
    totalSS += diff * diff;
  }
  
  // residual sum of squares
  let residualSS = 0;
  for (let i = 0; i < X.length; i++) {
    const pred = model(X[i]);
    const diff = y[i] - pred;
    residualSS += diff * diff;
  }
  
  return 1 - (residualSS / totalSS);
}

/**
 * Calculate Mean Absolute Error
 */
function calculateMAE(X, y, weights, bias) {
  const model = hypothesis(weights, bias);
  let errorSum = 0;
  
  for (let i = 0; i < X.length; i++) {
    errorSum += Math.abs(y[i] - model(X[i]));
  }
  
  return errorSum / X.length;
}

/**
 * Calculate Root Mean Squared Error
 */
function calculateRMSE(X, y, weights, bias) {
  const model = hypothesis(weights, bias);
  let squaredErrorSum = 0;
  
  for (let i = 0; i < X.length; i++) {
    const error = y[i] - model(X[i]);
    squaredErrorSum += error * error;
  }
  
  return Math.sqrt(squaredErrorSum / X.length);
}

/**
 * Train a simple linear regression model
 */
function trainLinearModel(X, y) {
  const XLinear = X.map(x => [x[0]]);
  
  let weight = 0;
  let bias = 0;
  let learningRate = alpha;
  let prevCost = Infinity;
  
  for (let iteration = 0; iteration < steps; iteration++) {
    const pred = (x) => bias + weight * x[0];
    
    // calculate gradients
    let weightGrad = 0;
    let biasGrad = 0;
    
    for (let j = 0; j < XLinear.length; j++) {
      const error = pred(XLinear[j]) - y[j];
      weightGrad += error * XLinear[j][0];
      biasGrad += error;
    }
    
    weightGrad = weightGrad / XLinear.length + (lambda * weight) / XLinear.length;
    biasGrad = biasGrad / XLinear.length;
    
    // update parameters
    weight -= learningRate * weightGrad;
    bias -= learningRate * biasGrad;
    
    // calculate current cost
    let currentCost = 0;
    for (let j = 0; j < XLinear.length; j++) {
      const error = pred(XLinear[j]) - y[j];
      currentCost += error * error;
    }
    currentCost = currentCost / XLinear.length;
    
    if (currentCost > prevCost) {
      learningRate /= 2;
    }
    prevCost = currentCost;
  }
  
  return { weights: [weight], bias, finalCost: prevCost };
}

/**
 * Generate predictions
 */
function predict(X, weights, bias) {
  const model = hypothesis(weights, bias);
  return X.map(x => model(x));
}

module.exports = { 
  gradDescent, 
  hypothesis, 
  predict,
  cost,
  calculateR2Score,
  calculateMAE,
  calculateRMSE,
  trainLinearModel
};
