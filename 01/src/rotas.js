const express = require('express')
const rotas = express()
const { newUser, login, userInfo } = require('./controllers/usuarios')
const isLogged = require('../src/middlewares/authentication')
const { newPokemon, setApelido, getPokemons, getPokemon, deletePokemon } = require('./controllers/pokemons')
rotas.post('/usuario/criar', newUser)
rotas.post('/usuario/login', login)

rotas.use(isLogged)

rotas.get('/usuario/info', userInfo)
rotas.post('/pokemon/criar', newPokemon)
rotas.patch('/pokemon/atualizar/apelido', setApelido)
rotas.get('/pokemon/listar', getPokemons)
rotas.get('/pokemon/:id', getPokemon)
rotas.get('/pokemon/delete/:id', deletePokemon)



module.exports = rotas
