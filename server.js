const express = require("express")
const mongoose = require("mongoose") 
require('dotenv').config();
const routes = require("./router")

const mongoString = process.env.DATABASE_URL
const app = express()
app.set('view engine', 'ejs');

mongoose
    .connect(mongoString, { useNewUrlParser: true })
    .then(() => {
        
        app.use(express.json()) 

        app.use(routes) 

        app.listen(3000, () => {
            console.log("Server has started!")
        })
    })

    