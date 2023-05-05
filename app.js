const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const port = process.env.port || 5001;
const cors = require('cors');

const logger = require('./src/middlewares/logger');

const tasksRouter = require('./src/routes/tasks');

require('dotenv').config();

// Database connection
const mongoDB =
	'mongodb+srv://' +
	process.env.DB_USER +
	':' +
	process.env.DB_PASSWORD +
	'@' +
	process.env.DB_SERVER +
	'/' +
	process.env.DB_NAME +
	'?retryWrites=true&w=majority';
async function main() {
	await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

// Middlewares
app.use(cors());
app.use(logger);
app.use(express.json());

// Routes
app.get('/', (req, res) => {
	res.status(200).send('TODO app');
});

app.use('/tasks', tasksRouter);

// App start
app.listen(port, () => {
	console.log(`App running in http://localhost:${port}`);
});
