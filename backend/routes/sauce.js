const express = require("express")
const router = express.Router();
const auth = require("../middleware/auth")

const sauceControllers = require("../controllers/sauce")


// requete create, read, update, delete (CRUD) de sauce
router.post("/", auth, sauceControllers.createSauce);

router.put("/:id", auth, sauceControllers.modifySauce);

router.delete("/:id", auth, sauceControllers.deleteSauce);

router.get("/:id", auth, sauceControllers.oneSauce);

router.get("/", auth, sauceControllers.allSauce);

module.exports = router;