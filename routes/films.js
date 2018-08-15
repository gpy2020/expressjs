const express = require("express");
const router = express.Router();
const filmCategories = require("./filmCategories");

router.use(express.urlencoded());
router.use(express.json());

router
  .route("/films")
  .get((req, res, next) => {
    res.send([]);
  })
  .post((req, res, next) => {
    res.json(value);
  });

router
  .route("/films/:id")
  .put((req, res, next) => {
    res.json(value);
  })
  .delete((req, res, next) => {
    res.json({ success: true, id: req.params.id });
  });

router.use("/films/", filmCategories);

module.exports = router;
