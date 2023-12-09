const express = require("express");
const cors = require("cors");
const routes = require("./routers"); // Assuming this file exports your routes array
// routes.js or other CommonJS files
const app = express();
// Add this line to enable JSON body parsing
app.use(express.json());
// Use the cors middleware to enable Cross-Origin Resource Sharing
app.use(cors());
// Iterate over the routes array and set up the routes
routes.forEach((route) => {
  const { method, path, handler } = route;
  app[method.toLowerCase()](path, handler);
});
// Set the port for the server to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
