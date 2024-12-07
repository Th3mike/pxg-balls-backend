const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const PORT = 5000;
const cors = require("cors"); // Importa o CORS

app.use(cors());

app.get("/get-pokemon", async (req, res) => {
  try {
    const response = await axios.get(
      "https://wiki.pokexgames.com/index.php/NPC_Heather_(Pok%C3%A9mon)"
    );
    const $ = cheerio.load(response.data);

    let pokemonData = [];

    // Itera sobre cada linha do tbody
    $("tbody tr").each((_, row) => {
      const cells = $(row).find("td"); // Todas as células dentro da linha
      if (cells.length >= 3) {
        for (let i = 0; i < cells.length; i += 4) {
          // Avança a cada 4 colunas
          const imageUrl = $(cells[i])
            .find("img")
            .attr("src"); // URL da imagem do Pokémon
          const name = $(cells[i + 1])
            .text()
            .trim(); // Nome do Pokémon
          const price = $(cells[i + 2])
            .text()
            .trim(); // Preço do Pokémon

          // Adiciona ao array se ambos os valores forem encontrados
          if (name && price && imageUrl) {
            pokemonData.push({
              name,
              price,
              imageUrl: `https://wiki.pokexgames.com${imageUrl}`, // Prefixa com o domínio completo
            });
          }
        }
      }
    });

    // Retorna os dados em JSON
    res.json(pokemonData);
  } catch (error) {
    console.error("Erro ao buscar ou processar os dados:", error);
    res.status(500).send("Erro ao buscar os dados.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
