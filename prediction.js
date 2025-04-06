// Simple ARIMA-like prediction model
class StockPredictor {
    constructor() {
        this.model = null;
    }

    // Train model with historical data
    train(historicalData) {
        // In a real implementation, this would use TensorFlow.js
        // For demo purposes, we'll use a simple moving average approach
        this.model = {
            lastValue: historicalData[historicalData.length - 1],
            trend: this.calculateTrend(historicalData)
        };
    }

    // Calculate simple trend
    calculateTrend(data) {
        if (data.length < 2) return 0;
        const sum = data.reduce((acc, val) => acc + val, 0);
        const mean = sum / data.length;
        let numerator = 0;
        let denominator = 0;
        
        for (let i = 0; i < data.length; i++) {
            numerator += (i - (data.length - 1)/2) * (data[i] - mean);
            denominator += Math.pow(i - (data.length - 1)/2, 2);
        }
        
        return numerator / denominator;
    }

    // Predict next n values
    predict(steps = 5) {
        if (!this.model) throw new Error('Model not trained');
        
        const predictions = [];
        let lastValue = this.model.lastValue;
        
        for (let i = 0; i < steps; i++) {
            lastValue += this.model.trend;
            predictions.push(lastValue);
        }
        
        return predictions;
    }
}

// Initialize predictor
const predictor = new StockPredictor();

// Handle prediction button click
document.getElementById('predictBtn').addEventListener('click', () => {
    const input = document.getElementById('historicalData').value;
    const historicalData = input.split(',').map(Number).filter(n => !isNaN(n));
    
    if (historicalData.length < 5) {
        alert('Please enter at least 5 historical data points');
        return;
    }

    // Train and predict
    predictor.train(historicalData);
    const predictions = predictor.predict();
    
    // Update chart
    const chart = Chart.getChart('predictionChart');
    chart.data.labels = Array.from({length: historicalData.length + predictions.length}, (_, i) => `Day ${i+1}`);
    chart.data.datasets[0].data = historicalData;
    chart.data.datasets[1].data = [...Array(historicalData.length).fill(null), ...predictions];
    chart.update();
});