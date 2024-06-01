const pool = require("../connection");
const bcrypt = require("bcrypt");
require('dotenv').config()
const jwt = require('jsonwebtoken')

class Usuarios {
  async newUser(req, res) {
    const { nome, email, senha } = req.body;

    try {
      const password = await bcrypt.hash(senha, 10);

      const setNewuser = await pool.query(
        "insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *",
        [nome, email, password]
      );

      return res.status(201).json(setNewuser.rows[0]);
    } catch (error) {}

    return res.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }

  async login(req, res) {
    const { email, senha } = req.body;

    try {
      const user = await pool.query("select * from usuarios where email = $1", [
        email,
      ]);

      if (user.rowCount < 1) {
        return res.status(404).json({ mensagem: "Email ou senha invalida" });
      }

      const senhaValida = await bcrypt.compare(senha, user.rows[0].senha);

      if (!senhaValida) {
        return res.status(400).json({ mensagem: "Email ou senha invalida" });
      }

      const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_PASSWORD, {
        expiresIn: "8h",
      });

      const { senha: _, ...loggedUser} = user.rows[0]

      return res.status(200).json({ usuario: loggedUser, token })
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
  }

  async userInfo(req, res) {
    return res.status(200).json(req.usuario)
  }
}

module.exports = new Usuarios();
