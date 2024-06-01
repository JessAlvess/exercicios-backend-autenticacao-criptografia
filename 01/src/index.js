require('dotenv').config()

const express = require('express')
const rotas = require('./rotas')
const port = process.env.PORT
const app = express()

app.use(express.json())
app.use(rotas)

app.listen(port)
