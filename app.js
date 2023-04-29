const express = require('express')

const router = express.Router();
const app = express()
const port = process.env.port || 5001

const logger = require('./src/middlewares/logger');

const tasksRouter = require('./src/routes/tasks');

// Middlewares
app.use(logger)
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.status(200).send("TODO app")
})

app.use('/tasks',tasksRouter)

// App start
app.listen(port, () => {
  console.log(`App running in http://localhost:${port}`)
})