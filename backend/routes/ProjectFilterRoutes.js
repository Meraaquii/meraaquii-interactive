const router = require("express").Router();

const {
  createProjectFilter,
} = require("../controllers/createProjectFilterController.js");

router.post("/create", createProjectFilter);

module.exports = router;
