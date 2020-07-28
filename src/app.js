const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
 return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repo)

  return response.json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repo = repositories.find((repository) => repository.id === id);

  if (!repo) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const newRepo = {
    ...repo,
    title: title || repo.title,
    url: url || repo.url,
    techs: techs || repo.techs,
  };

  repositories = repositories.filter((repository) =>
    repository.id === id ? newRepo : repository
  );

  return response.json(newRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repo = repositories.find((repository) => repository.id === id);

  if (!repo) {
    return response.status(400).json({ error: "Repository not found." });
  }

  repositories = repositories.filter((repository) => !(repository.id === id));

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repo = repositories.find((repository) => repository.id === id);

  if (!repo) {
    return response.status(400).json({ error: "Repository not found." });
  }

  const newRepo = {
    ...repo,
    likes: repo.likes += 1
  };

  repositories = repositories.filter((repository) =>
    repository.id === repo.id ? newRepo : repository
  );

  return response.json(newRepo);
});

module.exports = app;
