const express = require("express")
const router = express.Router();
const auth = require("../middleware/auth")
const multer = require("../middleware/multer")

const sauceControllers = require("../controllers/sauce")


// Routes create, read, update, delete (CRUD) et Routes like/dislike de notesauce
router.post("/", auth, multer, sauceControllers.createSauce);

router.post("/:id/like", auth, sauceControllers.noteSauce )

router.put("/:id", auth, multer, sauceControllers.modifySauce);

router.delete("/:id", auth, sauceControllers.deleteSauce);

router.get("/:id", auth, sauceControllers.oneSauce);

router.get("/", auth, sauceControllers.allSauce);



module.exports = router;