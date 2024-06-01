const express = require('express')
const rotas = express()
const { newUser, login } = require('./controllers/usuarios')

rotas.get('/usuario/criar', newUser)
rotas.post('/usuario/login', login)

module.exports = rotas
