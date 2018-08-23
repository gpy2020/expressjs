const express = require("express");
const app = express();
const morgan = require("morgan");
const logger = morgan("combined");

const films = require("./routes/films");

app.use(logger).use("/api/", films);

app.listen(process.env.PORT, () =>
  console.log("listening on http://localhost:3000/api/films")
);
