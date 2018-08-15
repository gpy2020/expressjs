const express = require("express");
const router = express.Router();
const Joi = require("joi");

router.use(express.urlencoded());
router.use(express.json());

const categories = [];

const schemaCategory = Joi.object().keys({
  id: Joi.required(),
  title: Joi.string()
    .min(3)
    .required(),
  description: Joi.string()
    .min(3)
    .max(500)
    .required(),
  films: Joi.array()
    .items(Joi.number())
    .required()
});

router
  .route("/categories")
  .get((req, res, next) => {
    res.send(categories);
  })
  .post((req, res, next) => {
    Joi.validate(req.body, schemaCategory, (err, value) => {
      if (err) {
        res.status(400).send(`${res.statusCode}: ${err.message}`);
      } else {
        res.json(req.body);
      }
    });
  });
router
  .route("/categories/:id")
  .put((req, res, next) => {
    Joi.validate(req.body, schemaCategory, (err, value) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.json(value);
      }
    });
  })
  .delete((req, res, next) => {
    res.json({ success: true, id: req.params.id });
  });
module.exports = router;
