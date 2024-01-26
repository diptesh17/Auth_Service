const express = require("express");
const { PORT } = require("./config/serverConfig.js");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/index.js");
const app = express();

const startServer = () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", apiRoutes);
  app.listen(PORT, () => {
    console.log(`Server started : ${PORT}`);
  });
};

startServer();
