const express = require("express");
const { PORT } = require("./config/serverConfig.js");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/index.js");
const app = express();

const db = require("./models/index.js");

const startServer = () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", apiRoutes);
  app.listen(PORT, async () => {
    console.log(`Server started : ${PORT}`);
    if (process.env.DB_SYNC) {
      db.sequelize.sync({ alter: true });
    }
  });
};

startServer();
