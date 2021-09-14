const db = require("../models");
const News = db.news;

// Create and Save a News
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const data = {
    logo: req.body.logo,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
  };

  try {
    const response = News.create(data)
    res.send(response)
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
};

// Retrieve all News from the database.
exports.findAll = async (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  try {
    const data = await News.findAll()
    res.send(data)
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

// Update a News by the id in the request
exports.update = async (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const id = req.params.id;

  try {
    const ret = await News.update(req.body, {
      where: { id: id },
    })
    if (ret == 1) {
      res.send({
        message: "A News was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update News with id=${id}. Maybe News was not found or req.body is empty!`,
      });
    }

  } catch (error) {
    res.status(500).send({
      message: "Error updating News with id=" + id,
    });
  }
};

// Delete a News with the specified id in the request
exports.delete = async (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  const id = req.params.id;

  try {
    const ret = await News.destroy({
      where: { id: id },
    })
    if (ret == 1) {
      res.send({
        message: "News was deleted successfully!",
      });
    } else {
      res.send({
        message: `Cannot delete News with id=${id}. Maybe News was not found!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Could not delete News with id=" + id,
    });
  }
};

// Delete all Users from the database.
exports.deleteAll = async (req, res) => {
  // Validate request
  if (!req.user) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  try {
    const ret = await News.destroy({
      where: {},
      truncate: false,
    })
    res.send({ message: `${ret} News were deleted successfully!` });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all news.",
    });
  }
};
