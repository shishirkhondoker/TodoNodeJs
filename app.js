const http = require("http");
const fs = require("fs");
const path = require("path");

// DataBase
let todos = [
  { id: 1, text: "Learn Node js", completed: false },
  { id: 2, text: "Build a Nodejs project", completed: false },
  { id: 3, text: "Work hard", completed: false },
];

// Create Server
const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    staticFile(res, "./index.html", "text/html");
  } else if (req.url === "/api/todos" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(todos));
  } else if (req.url === "/addTodo" && req.method === "POST") {
    handlePostRequest(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

// Serve Static Files
function staticFile(res, filePath, contentType) {
  const fullPath = path.join(__dirname, filePath);
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Error loading file");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

// Handle POST Request
function handlePostRequest(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const newTodo = JSON.parse(body);
    newTodo.id = todos.length + 1;
    todos.push(newTodo);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(newTodo));
  });
}

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
