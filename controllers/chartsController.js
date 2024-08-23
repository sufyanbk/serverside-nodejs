const axios = require('axios');//module required for external api communication

exports.getIntradayData = async (req, res) => { //function to get historical data for the stocks based on ticker symbol
    const { symbol, interval } = req.query; // Use req.query to handle GET request query parameters
    const url = `https://www.alphavantage.co/query`; //The url for the api to be built upon
    const outputSize = "full"; //gives the past 30 days of history
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

            // Extract all the high prices into an array, as well as low, open and close prices
            const highPrices = Object.keys(timeSeriesData).map(timestamp => parseFloat(timeSeriesData[timestamp]["2. high"]));
            const lowPrices = Object.keys(timeSeriesData).map(timestamp => parseFloat(timeSeriesData[timestamp]["3. low"]));
            const closePrices = Object.keys(timeSeriesData).map(timestamp => parseFloat(timeSeriesData[timestamp]["4. close"]));
            const openPrices = Object.keys(timeSeriesData).map(timestamp => parseFloat(timeSeriesData[timestamp]["1. open"]));

            // Send the high prices, low, close and open as JSON response -- can be altered depending on what is wanted
            return res.json({ highPrices, lowPrices, closePrices, openPrices }); 
        } else {
            // Handle cases where the expected data is not found
            return res.status(404).json({ error: 'Data not found for the given symbol and interval.' });
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getGainersData = async (req, res) => { //function to get the biggest gainers of the day
    const apiKey = "SQAeFvgo3n8o7ghhKKUqabfCztICSW1Z"; // obvs change this when putting in proper
    const url = 'https://financialmodelingprep.com/api/v3/stock_market/gainers'; //url for the api query

    const params = {
        apikey: apiKey
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        // Check if data is an array and process it
        if (Array.isArray(data)) {
            // Map through the array and extract the necessary information
            const gainers = data.map(stock => ({
                symbol: stock.symbol,
                name: stock.name,
                change: parseFloat(stock.change),
                price: parseFloat(stock.price),
                changesPercentage: parseFloat(stock.changesPercentage)
            }));

            // Send the processed data as a JSON response
            return res.json({ gainers });
        } else {
            // Handle cases where data is not in the expected format
            return res.status(404).json({ error: 'Data not found or invalid format.' });
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getLosersData = async (req, res) => { //function to get data on the biggest losers of the day
    const apiKey = "SQAeFvgo3n8o7ghhKKUqabfCztICSW1Z"; // obvs change this when putting in proper
    const url = 'https://financialmodelingprep.com/api/v3/stock_market/losers';

    const params = {
        apikey: apiKey
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        // Check if data is an array and process it
        if (Array.isArray(data)) {
            // Map through the array and extract the necessary information
            const losers = data.map(stock => ({
                symbol: stock.symbol,
                name: stock.name,
                change: parseFloat(stock.change),
                price: parseFloat(stock.price),
                changesPercentage: parseFloat(stock.changesPercentage)
            }));

            // Send the processed data as a JSON response
            return res.json({ losers });
        } else {
            // Handle cases where data is not in the expected format
            return res.status(404).json({ error: 'Data not found or invalid format.' });
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getHistoricalData = async (req, res) => { //function to get historical commodity data
    const { symbol, from, to } = req.query; // Extract query parameters for symbol, from, and to dates
    const apiKey = "SQAeFvgo3n8o7ghhKKUqabfCztICSW1Z"; // obvs change this before making this public
    const url = `https://financialmodelingprep.com/api/v3/historical-chart/5min/${symbol}`; //url for accessing the api
    
    const params = {
        from: from, // Start date in format YYYY-MM-DD
        to: to,     // End date in format YYYY-MM-DD
        apikey: apiKey
    };

    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        // Check if data is an array and process it
        if (Array.isArray(data)) {
            //comment and un-comment depending on which datapoints you want to model
            const highData = data.map(entry => parseFloat(entry.high));
            //const lowData = data.map(entry => parseFloat(entry.low));
            //const closeData = data.map(entry => parseFloat(entry.close));

            // Send the processed data as a JSON response
            return res.json({ highData });
        } else {
            // Handle unexpected data format
            return res.status(404).json({ error: 'Data not found or invalid format.' });
        }
    } catch (error) {
        //Handles the error if something goes wrong server side
        console.error('Error fetching data:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

