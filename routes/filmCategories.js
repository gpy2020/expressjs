const express = require("express");
const router = express.Router();
const Joi = require("joi");

const r = require("rethinkdb");
let connect = null;
const filmCategories = r.db("films").table("filmCategories");

r.connect(
  "127.0.0.1",
  (err, conn) => {
    if (err) {
      throw err;
    }
    connect = conn;
  }
);

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

const schemaCategoryPut = Joi.object().keys({
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
    filmCategories.run(connect, (err, cursor) => {
      if (err) {
        throw err;
      }
      cursor.toArray((err, result) => {
        if (err) {
          throw err;
        }
        res.json(result);
      });
    });
  })
  .post((req, res, next) => {
    Joi.validate(req.body, schemaCategory, (err, value) => {
      if (err) {
        res.status(400).send(`${res.statusCode}: ${err.message}`);
      } else {
        filmCategories.insert(value).run(connect, (err, result) => {
          if (err) {
            throw err;
          }
          res.json(value);
        });
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
        filmCategories
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
    filmCategories
      .get(+req.params.id)
      .delete()
      .run(connect, (err, result) => {
        if (err) {
          throw err;
        }
        res.json({ success: true, id: req.params.id });
      });
  });
module.exports = router;
