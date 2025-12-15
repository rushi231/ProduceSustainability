// Global variables
let modelWeights = [];
let modelBias = 0;
let databox = null;
let tableSize = [1, 0]; // [items, weeks]
let myChart = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    databox = document.getElementsByClassName("data-labelling")[0];
    initializeChart();
    addWeek();
    addWeek();
}

/**
 * Train ML model
 */
async function getModel(X, y) {
    try {
        const response = await fetch('/pred', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: { X: X, y: y }
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const res = await response.json();
        
        // use the better performing model
        const bestModel = res.recommendation === 'polynomial' ? res.polynomial : res.linear;
        modelWeights = bestModel.weights;
        modelBias = bestModel.bias;
        
        console.log("Model trained successfully");
        console.log("Using:", res.recommendation, "model");
        console.log("R2 Score:", bestModel.r2Score);
        
        displayModelMetrics(res);
        
        return res;
    } catch (error) {
        console.error("Error training model:", error);
        showError("Failed to train model. Please try again.");
        throw error;
    }
}

/**
 * Show model performance metrics
 */
function displayModelMetrics(modelData) {
    const metricsDiv = document.getElementById("model-metrics");
    const poly = modelData.polynomial;
    const linear = modelData.linear;
    const recommended = modelData.recommendation;
    
    let html = `<h4>Model Performance</h4>`;
    
    html += `<div class="metric-row">`;
    html += `<span class="metric-label">Polynomial R-Squared:</span>`;
    html += `<span class="metric-value">${poly.r2Score.toFixed(3)}${recommended === 'polynomial' ? ' (selected)' : ''}</span>`;
    html += `</div>`;
    
    html += `<div class="metric-row">`;
    html += `<span class="metric-label">Polynomial MAE:</span>`;
    html += `<span class="metric-value">${poly.mae.toFixed(2)} units</span>`;
    html += `</div>`;
    
    html += `<div class="metric-row">`;
    html += `<span class="metric-label">Linear R-Squared:</span>`;
    html += `<span class="metric-value">${linear.r2Score.toFixed(3)}${recommended === 'linear' ? ' (selected)' : ''}</span>`;
    html += `</div>`;
    
    html += `<div class="metric-row">`;
    html += `<span class="metric-label">Linear MAE:</span>`;
    html += `<span class="metric-value">${linear.mae.toFixed(2)} units</span>`;
    html += `</div>`;
    
    html += `<p style="margin-top: 0.75rem; font-size: 0.85rem;">`;
    if (poly.r2Score > 0.8) {
        html += `Model explains ${(poly.r2Score * 100).toFixed(1)}% of the variance in your data.`;
    } else if (poly.r2Score > 0.6) {
        html += `Model fit is acceptable at ${(poly.r2Score * 100).toFixed(1)}% variance explained.`;
    } else {
        html += `Model explains ${(poly.r2Score * 100).toFixed(1)}% of variance. More data may improve accuracy.`;
    }
    html += `</p>`;
    
    metricsDiv.innerHTML = html;
    metricsDiv.style.display = "block";
}

/**
 * Hypothesis function for predictions
 */
function hypothesis(weights, bias) {
    return (x) => {
        let tot = bias;
        for (let i = 0; i < weights.length; i++) {
            tot += x[i] * weights[i];
        }
        return tot;
    };
}

/**
 * Add a new week row to the input table
 */
function addWeek() {
    const row = document.createElement("tr");
    
    // Week label cell
    const weekCell = document.createElement("td");
    weekCell.textContent = `Week ${tableSize[1] + 1}`;
    weekCell.classList.add("week-label");
    row.appendChild(weekCell);

    // Input cell
    const inputCell = document.createElement("td");
    const inputBox = document.createElement("input");
    inputBox.type = "number";
    inputBox.min = "0";
    inputBox.placeholder = "0";
    inputBox.classList.add("item0", "week" + tableSize[1], "data-label");
    inputCell.appendChild(inputBox);
    row.appendChild(inputCell);

    databox.appendChild(row);
    tableSize[1]++;
}

/**
 * Remove the last week row
 */
function removeWeek() {
    if (tableSize[1] > 1) {
        const rows = databox.getElementsByTagName("tr");
        databox.removeChild(rows[rows.length - 1]);
        tableSize[1]--;
    } else {
        showError("Must have at least one week of data!");
    }
}

/**
 * Clear all input data
 */
function clearData() {
    if (confirm("Are you sure you want to clear all data?")) {
        // Remove all weeks except header
        while (tableSize[1] > 0) {
            const rows = databox.getElementsByTagName("tr");
            if (rows.length > 1) {
                databox.removeChild(rows[rows.length - 1]);
                tableSize[1]--;
            } else {
                break;
            }
        }
        
        // Reset and add default weeks
        tableSize[1] = 0;
        addWeek();
        addWeek();
        
        // Clear chart
        setData(myChart, [], [], 0);
        setData(myChart, [], [], 1);
        
        // Clear prediction message
        document.getElementById("prediction").innerText = "";
        
        // Clear metrics
        const metricsDiv = document.getElementById("model-metrics");
        metricsDiv.innerHTML = "";
        metricsDiv.style.display = "none";
        
        clearError();
    }
}

/**
 * Get data from input fields
 */
function getData(item) {
    const X = [];
    const y = [];
    const allSales = document.getElementsByClassName("item" + item);

    for (let i = 0; i < allSales.length; i++) {
        X.push([i, i ** 2, i ** 3]); // polynomial regression features
        
        // Interpolate missing values
        if (allSales[i].value === "" && i > 0) {
            console.log("Filling in missing value for week " + (i + 1));
            allSales[i].value = allSales[i - 1].value;
        }
        
        const value = parseInt(allSales[i].value) || 0;
        y.push(value);
    }

    return { X, y };
}

/**
 * Validate input data
 */
function validateData(data) {
    if (data.X.length < 2) {
        showError("Please enter at least 2 weeks of sales data!");
        return false;
    }

    const allZeros = data.y.every(val => val === 0);
    if (allZeros) {
        showError("Please enter some non-zero sales values!");
        return false;
    }

    return true;
}

/**
 * Update chart with predictions
 */
async function updateChart() {
    try {
        clearError();
        
        const d = getData(0);
        
        if (!validateData(d)) {
            return;
        }

        // Add actual data points to chart
        setData(myChart, range(1, d.X.length + 1), d.y, 0);

        // Train ML model
        await getModel(d.X, d.y);
        console.log("Model is updated");

        const model = hypothesis(modelWeights, modelBias);
        const preds = [];

        // Calculate predictions for existing data
        for (let i = 0; i < d.X.length; i++) {
            preds.push(model(d.X[i]));
        }

        // Get number of weeks to predict from dropdown
        const predWeeksSelect = document.getElementById('predWeeks');
        const numPred = parseInt(predWeeksSelect.value);

        // Extrapolate for future weeks
        const futurePredictions = [];
        for (let i = d.X.length; i < d.X.length + numPred; i++) {
            const prediction = model([i, i ** 2, i ** 3]);
            preds.push(prediction);
            futurePredictions.push(prediction);
        }

        setData(myChart, range(1, preds.length + 1), preds, 1);
        predictionMsg(d.X.length + 1, futurePredictions);

    } catch (error) {
        console.error("Error updating chart:", error);
        showError("Failed to generate predictions. Please try again.");
    }
}

/**
 * Display prediction results
 */
function predictionMsg(week, amount) {
    const ele = document.getElementById("prediction");
    ele.innerText = "";
    
    let message = "Predictions:\n\n";
    for (let i = 0; i < amount.length; i++) {
        const predicted = Math.max(0, Math.round(amount[i]));
        message += `Week ${week + i}: ${predicted} units\n`;
    }
    
    ele.innerText = message;
}

/**
 * Create sequential array from start to end
 */
function range(start, end) {
    const r = [];
    for (let i = start; i < end; i++) {
        r.push(i);
    }
    return r;
}

/**
 * Initialize the chart
 */
function initializeChart() {
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');

    const data = {
        labels: [],
        datasets: [{
            label: 'Actual Sales',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1,
            pointRadius: 5,
            pointHoverRadius: 7
        },
        {
            label: 'Predicted Sales',
            data: [],
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderDash: [5, 5],
            tension: 0.1,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };

    myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Units Sold'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Week Number'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

/**
 * Update chart data
 */
function setData(chart, labels, data, dataset) {
    chart.data.labels = labels;
    chart.data.datasets[dataset].data = data;
    chart.update();
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.getElementById("error-message");
    errorDiv.innerText = message;
    errorDiv.style.display = "block";
}

/**
 * Clear error message
 */
function clearError() {
    const errorDiv = document.getElementById("error-message");
    errorDiv.innerText = "";
    errorDiv.style.display = "none";
}

/**
 * Fetch database data (for future use)
 */
async function fetchDatabaseData() {
    try {
        const storeName = document.getElementById("storeName").value;
        const storeLocation = document.getElementById("storeLocation").value;
        const itemName = document.getElementById("itemName").value;

        if (!storeName || !storeLocation || !itemName) {
            showError("Please fill in store information first!");
            return;
        }

        const res = await axios.get('/sales-history', {
            params: { storeName, storeLocation, itemName }
        });
        
        console.log("Database data:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching database data:", error);
        showError("Failed to fetch data from database.");
        throw error;
    }
}

/**
 * Save current data to database
 */
async function saveSalesData() {
    try {
        const storeName = document.getElementById("storeName").value;
        const storeLocation = document.getElementById("storeLocation").value;
        const itemName = document.getElementById("itemName").value;

        if (!storeName || !storeLocation || !itemName) {
            showError("Please fill in all store information!");
            return;
        }

        const data = getData(0);
        
        // Save each week's data
        for (let i = 0; i < data.y.length; i++) {
            await axios.post('/save-sales', {
                storeName,
                storeLocation,
                itemName,
                quantitySold: data.y[i],
                priceSold: 0 // Can be extended to include price input
            });
        }

        alert("Sales data saved successfully!");
    } catch (error) {
        console.error("Error saving sales data:", error);
        showError("Failed to save data to database.");
    }
}
