const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const repositoriesFiltered = title
    ? repositories.filter(repo => repo.title.includes(title))
    : repositories;

  return response.json(repositoriesFiltered)
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repositoryData = { id: uuid(), url, title, techs, likes: 0 }

  repositories.push(repositoryData)

  return response.json(repositoryData)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'O repositório informado não foi encontrado.' })
  }

  delete request.body.likes

  const repositoryData = {
    ...repositories[repositoryIndex],
    ...request.body,
  }

  repositories[repositoryIndex] = repositoryData

  return response.json(repositoryData)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'O repositório informado não foi encontrado.' })
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: 'O repositório informado não foi encontrado.' })
  }

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
