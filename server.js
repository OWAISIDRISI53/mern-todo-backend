// const express = require("express")
// const connectToMongo = require('./db')
import express from "express"
import connectToMongo from './db.js'
import routes from "./routes/index.js"
import dotenv from "dotenv"
import cors from "cors"
const app = express()

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL if necessary
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add more methods as required
    credentials: true, // Allow credentials to be sent (e.g., cookies)
}));
dotenv.config()
const PORT = process.env.PORT || 5000

connectToMongo()

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Welcome to mern-todo")
})


app.use('/api', routes)

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})