const express = require("express");
const router = express.Router();

router.use(express.urlencoded());
router.use(express.json());

router
  .route("/categories")
  .get((req, res, next) => {
    res.send([]);
  })
  .post((req, res, next) => {
    res.json(req.body);
  });
router
  .route("/categories/:id")
  .put((req, res, next) => {
    res.json(req.body);
  })
  .delete((req, res, next) => {
    res.json({ success: true, id: req.params.id });
  });
module.exports = router;
