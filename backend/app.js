const express = require('express');
const app = express();
const path = require('path');
const defaultPort = 3000;
require('dotenv').config();//this activates the ability to parse the .env file



//automatically parse any incoming requests into a JSON format
app.use(express.json());