/my-express-app
├── /config              # Contains configuration files, such as database configuration
│   └── database.js      # Configures Sequelize to connect to a MySQL database
├── /models              # Contains Sequelize models, which define the database structure
│   └── asset.js         # Defines the 'Asset' model that maps to the 'assets' table in MySQL
├── /routes              # Contains route definitions for handling HTTP requests
│   └── assetRoutes.js   # Defines routes related to assets, such as fetching all assets
├── /controllers         # Contains controller functions that handle the logic for each route
│   └── assetController.js  # Defines the logic for retrieving assets from the database
├── /app.js              # Main entry point for the Express application
└── /package.json        # Contains metadata about the project and dependencies


