require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

const Persons = require("./models/persons");
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (_req, res, next) => {
  Persons.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (_req, res) => {
  const date = new Date();
  let count = 0;
  Persons.find({}).then((result) => {
    count = result.length;
    res.send(
      `<div>Phonebook has info for ${count} people</div><div>${date}</div>`
    );
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Persons.findById(id)
    .then((result) => {
      if (result) {
        res.json(result);
      }
      res.status(404).json({
        error: "Person not found",
      });
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Persons.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new Persons({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Persons.findByIdAndUpdate(id, person, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      console.log("Test", error);
      next(error);
    });
});

const errorHandler = (error, _request, response, next) => {
  if (error.name === "ValidationError") {
    return response.status(400).json({
      message: error.message,
    });
  }
  if (error.name === "CastError") {
    return response.status(400).json({ message: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
