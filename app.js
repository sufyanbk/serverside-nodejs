const express = require('express');
const app = express();
const assetRoutes = require('./routes/assetRoutes');

// Middleware to parse JSON
app.use(express.json());

// Use the asset routes
app.use('/api', assetRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
