const express = require('express');
const dotenv = require('dotenv');

// Load env config
dotenv.config({ path: './config/config.env'});

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`App is running in ${process.env.NODE_ENV} mode and listening to port ${PORT}`));