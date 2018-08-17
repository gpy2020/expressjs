const express = require("express");
const router = express.Router();
const filmCategories = require("./filmCategories");
const Joi = require("joi");

const r = require("rethinkdb");
let connect = null;
const films = r.db("films").table("films");

r.connect(
  "127.0.0.1",
  (err, conn) => {
    if (err) {
      throw err;
    }
    connect = conn;
  }
);

const schemaFilm = Joi.object().keys({
  id: Joi.required(),
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

const schemaFilmPut = Joi.object().keys({
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
  .get(async (req, res, next) => {
    films.run(connect, (err, cursor) => {
      if (err) {
        throw err;
      }
      cursor.toArray((err, result) => {
        if (err) {
          throw err;
        }
        if (result.length > 10) {
          const resultArr = [];
          result.map(item => {
            resultArr.push(item);
          });
          res.json(resultArr);
        } else res.json(result);
      });
    });
  })
  .post((req, res, next) => {
    Joi.validate(req.body, schemaFilm, async (err, value) => {
      if (err) {
        res.status(400).send(`${res.statusCode}: ${err.message}`);
      } else {
        films.insert(value).run(connect, (err, result) => {
          if (err) {
            throw err;
          }
          res.json(value);
        });
      }
    });
  });

router
  .route("/films/:id")
  .put((req, res, next) => {
    Joi.validate(req.body, schemaFilmPut, (err, value) => {
      if (err) {
        res.status(400).send(`${res.statusCode}: ${err.message}`);
      } else {
        films
          .get(+req.params.id)
          .update(value)
          .run(connect, (err, result) => {
            if (err) {
              throw err;
            }
            res.json(value);
          });
      }
    });
  })
  .delete((req, res, next) => {
    films
      .get(+req.params.id)
      .delete()
      .run(connect, (err, result) => {
        if (err) {
          throw err;
        }
        res.json({ success: true, id: req.params.id });
      });
  });
router.use("/films/", filmCategories);

module.exports = router;
