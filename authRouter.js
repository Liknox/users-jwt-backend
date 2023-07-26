const Router = require("express")
const controller = require("./authController")
const router = new Router()
const { check } = require("express-validator")
const roleMiddleware = require("./middleware/roleMiddleware.js")

router.post(
	"/registration",
	[
		check("username", "Username can't be empty!").notEmpty(),
		check("password", "Password should be bigger than 4 and less than 10 symbols!").isLength({ min: 4, max: 10 }),
	],
	controller.registration
)
router.post("/login", controller.login)
router.get("/users", roleMiddleware(["USER"]), controller.getUsers)

module.exports = router
