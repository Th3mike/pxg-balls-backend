const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors"); // Importa o CORS

const app = express();
const PORT = process.env.PORT || 5000; // Usa a porta do Render ou 5000 como fallback

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

// Endpoint para manter o serviço ativo
app.get("/", (req, res) => {
  res.send("Serviço ativo! Use /get-pokemon para obter os dados.");
});

// Simula uma tarefa repetitiva (worker) em segundo plano
const executarWorker = () => {
  console.log("Worker iniciado!");
  setInterval(() => {
    console.log("Worker executando tarefa...");
    // Adicione aqui a lógica do worker, se necessário
  }, 60000); // Executa a cada 60 segundos
};

// Inicia o worker
executarWorker();

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
