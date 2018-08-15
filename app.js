const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./src/views");

const errorHandler = function(err, req, res, next) {
  res.status(500).json({ statusCode: res.statusCode, error: err.message });
  console.log(err);
};

app.get("/api/hello-world/:name?", (req, res, next) => {
  if (!req.params.name) {
    next(new Error("not found"));
  }
  res.render("index", { name: req.params.name });
});

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log("App is listening on port 3000!")
);
