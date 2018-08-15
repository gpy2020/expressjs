const express = require("express");
const router = express.Router();
const filmCategories = require("./filmCategories");
const Joi = require("joi");

const schemaFilm = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string()
    .required()
    .min(3),
  description: Joi.string()
    .required()
    .min(3)
    .max(500),
  rating: Joi.number()
    .min(0)
    .max(5),
  category: Joi.string(),
  avatar: Joi.string()
    .uri()
    .required(),
  galery: Joi.array().items(
    Joi.string()
      .uri()
      .required(),
    Joi.string()
      .uri()
      .required(),
    Joi.string()
      .uri()
      .required(),
    Joi.string()
      .uri()
      .required()
  )
});

router.use(express.urlencoded());
router.use(express.json());

router
  .route("/films")
  .get((req, res, next) => {
    res.send([]);
  })
  .post((req, res, next) => {
    Joi.validate(req.body, schemaFilm, (err, value) => {
      if (err) {
        res.status(400).send(`${res.statusCode}: ${err.message}`);
      } else {
        res.json(value);
      }
    });
  });

router
  .route("/films/:id")
  .put((req, res, next) => {
    Joi.validate(req.body, schemaFilm, (err, value) => {
      if (err) {
        res.status(400).send(`${res.statusCode}: ${err.message}`);
      } else {
        res.json(value);
      }
    });
  })
  .delete((req, res, next) => {
    res.json({ success: true, id: req.params.id });
  });

router.use("/films/", filmCategories);

module.exports = router;
