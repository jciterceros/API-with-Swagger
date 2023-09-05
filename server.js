const express = require("express");
const app = express();
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Defina as opções do Swagger
let options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API CRUD com Swagger e Node.js",
      version: "1.0.0",
      description: "API de testes com Swagger",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Servidor Local",
      },
    ],
  },
  apis: ["./server.js"], // O arquivo que contém suas rotas
};

const swaggerSpec = swaggerJsdoc(options);

// Middleware para servir a documentação Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Dados de exemplo
let data = [
  {
    id: 1,
    name: "Fernando Terceros",
    username: "jci_terceros",
    email: "jciterceros@domain.com",
  },
];

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>O que é uma API REST?</title>
  </head>
  <body>
      <h1>O que é uma API REST?</h1>
      <p>API REST, ou <strong>Arquitetura de Transferência de Estado Representacional</strong>, é um conjunto de princípios e convenções para projetar e interagir com serviços web. É amplamente usado na construção de aplicativos web e móveis.</p>
      
      <h2>Principais Características de uma API REST:</h2>
      <ul>
          <li><strong>Recursos:</strong> Tudo em uma API REST é considerado um recurso, como usuários, produtos ou posts.</li>
          <li><strong>Verbos HTTP:</strong> Ela utiliza os verbos HTTP (GET, POST, PUT, DELETE) para realizar operações nos recursos.</li>
          <li><strong>Stateless:</strong> Cada requisição para a API deve conter todas as informações necessárias, tornando a API independente de estado.</li>
          <li><strong>Representações:</strong> Os recursos podem ser representados em diferentes formatos, como JSON ou XML.</li>
          <li><strong>URI (Uniform Resource Identifier):</strong> Cada recurso é acessado por meio de uma URI única.</li>
          <li><strong>HATEOAS:</strong> Uma API REST pode incluir links para recursos relacionados, permitindo a descoberta dinâmica de endpoints.</li>
      </ul>
  
      <h2>Vantagens de Usar uma API REST:</h2>
      <ul>
          <li>Simplicidade e fácil compreensão.</li>
          <li>Integração com várias plataformas e linguagens.</li>
          <li>Escalabilidade e flexibilidade.</li>
          <li>Padrão amplamente adotado na indústria.</li>
      </ul>
  
      <p>Em resumo, uma API REST é uma abordagem padrão para a criação de serviços web que é simples, escalável e amplamente aceita na indústria de desenvolvimento de software.</p>
      <h2>API de testes com Swagger</h2>
      <p>Veja a <a href="/api-docs">documentação</a>.</p>
  </body>
  </html>
  `);
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retorna todos os usuários
 *     description: Retorna todos os usuários da API.
 *     responses:
 *       '200':
 *         description: Sucesso - Retorna a lista de usuários.
 */
app.get("/api/users", (req, res) => {
  res.json(data);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cria um novo usuário com os dados fornecidos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Sucesso - Retorna o usuário criado.
 */
app.post("/api/users", (req, res) => {
  const newUser = req.body;
  newUser.id = data.length + 1;
  data.push(newUser);
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     description: Retorna um usuário específico com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser retornado.
 *     responses:
 *       '200':
 *         description: Sucesso - Retorna o usuário com o ID especificado.
 *       '404':
 *         description: Usuário não encontrado.
 */
app.get("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = data.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  res.json(user);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     description: Atualiza um usuário existente com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Sucesso - Retorna o usuário atualizado.
 *       '404':
 *         description: Usuário não encontrado.
 */
app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  const existingUserIndex = data.findIndex((u) => u.id === userId);

  if (existingUserIndex === -1) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  data[existingUserIndex] = { ...data[existingUserIndex], ...updatedUser };
  res.json(data[existingUserIndex]);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID
 *     description: Exclui um usuário existente com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser excluído.
 *     responses:
 *       '204':
 *         description: Sucesso - Usuário excluído com sucesso.
 *       '404':
 *         description: Usuário não encontrado.
 */
app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const existingUserIndex = data.findIndex((u) => u.id === userId);

  if (existingUserIndex === -1) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  data.splice(existingUserIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
