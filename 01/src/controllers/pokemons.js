const pool = require("../connection");

class Pokemons {
  async newPokemon(req, res) {
    const { nome, habilidades, imagem, apelido } = req.body;
    const { id } = req.usuario;

    try {
      const setNewPoke = await pool.query(
        "insert into pokemons (usuario_id, nome, habilidades, imagem, apelido) values ($1, $2, $3, $4, $5) returning *",
        [id, nome, habilidades, imagem, apelido]
      );

      return res.status(201).json(setNewPoke.rows[0]);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

  async setApelido(req, res) {
    const { apelidoNovo, apelidoAntigo } = req.body;
    const { id } = req.usuario
    try {
      const setNewNickname = await pool.query(
        "UPDATE pokemons SET apelido = $1 WHERE apelido = $2 AND usuario_id = $3 returning *",
        [apelidoNovo, apelidoAntigo, id]
      );

      return res.status(201).json(setNewNickname.rows[0]);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

  async getPokemons(req, res) {
    try {
      const getPokemons = await pool.query(
        "SELECT id, (select nome from usuarios where usuarios.id = p.usuario_id) as usuario, nome, habilidades, imagem, apelido FROM pokemons p",
      );

      getPokemons.rows.map((pokemons) => {
        return pokemons.habilidades = pokemons.habilidades.split(', ')
      })

      console.log(getPokemons.rows);
      return res.status(201).json(getPokemons.rows);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

  async getPokemon(req, res) {
    const { id } = req.params
    try {
      const getPokemons = await pool.query(
        "SELECT * FROM pokemons WHERE id = $1",
        [id]
      );

      return res.status(201).json(getPokemons.rows);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }

  async deletePokemon(req, res) {
    const { id } = req.params
    try {
      const deletePokemons = await pool.query(
        "DELETE FROM pokemons WHERE id=$1 RETURNING *;",
        [id]
      );

      return res.status(201).json(deletePokemons.rows);
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
  }
}

module.exports = new Pokemons();
