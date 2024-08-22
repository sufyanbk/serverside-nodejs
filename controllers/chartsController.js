const axios = require('axios');

exports.getIntradayData = async (req, res) => {
    const { symbol, interval } = req.query; // Use req.query to handle GET request query parameters
    const url = `https://www.alphavantage.co/query`;
    const outputSize = "full";
    const apiKey = "6J0XU4I1S15EICOI"; //obvs needs to be changed into an environmental variable before going public
    const params = {
        function: 'TIME_SERIES_INTRADAY',
        symbol: symbol,
        interval: interval,
        apikey: apiKey,
        outputsize: outputSize,
    };

    try {
        const response = await axios.get(url, { params });

        // Adjust based on the interval (e.g., 5min, 15min, etc.)
        const timeSeriesKey = `Time Series (${interval})`;

        if (response.data[timeSeriesKey]) {
            const timeSeriesData = response.data[timeSeriesKey];

            // Extract all the high prices into an array, can easily be changed to low prices etc
            const highPrices = Object.keys(timeSeriesData).map(timestamp => parseFloat(timeSeriesData[timestamp]["2. high"]));

            // Send the high prices as JSON response
            return res.json({ highPrices });
        } else {
            // Handle cases where the expected data is not found
            return res.status(404).json({ error: 'Data not found for the given symbol and interval.' });
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};