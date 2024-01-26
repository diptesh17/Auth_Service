const express = require("express");
const { PORT } = require("./config/serverConfig.js");

const startServer = () => {
  const app = express();

  app.listen(PORT, () => {
    console.log(`Server started : ${PORT}`);
  });
};

startServer();
