var express = require("express");
const router = express.Router();

const SearchController = require("../controllers/SearchController");
const PodcastController = require("../controllers/PodcastController");

router.get("/searchpodcast", SearchController.search);

router.get("/podcast", PodcastController.getAll);

router.post("/podcast", PodcastController.save);

router.put("/podcast/:index/:id", PodcastController.alterar);

router.delete("/podcast/:index", PodcastController.delete);

module.exports = router;
