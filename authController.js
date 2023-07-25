const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")
const User = require("./models/User.js")
const Role = require("./models/Role.js")
const { secret } = require("./config.js")

const generateAccessToken = (id, roles) => {
	const payload = { id, roles }
	return jwt.sign(payload, secret, { expiresIn: "24h" })
}

class authController {
	async registration(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: "Error during registration", errors })
			}
			const { username, password } = req.body
			const candidate = await User.findOne({ username })
			if (candidate) {
				return res.status(400).json({ message: "User with this name is already exist." })
			}
			const hashPassword = bcrypt.hashSync(password, 7)
			const userRole = await Role.findOne({ value: "USER" })
			const user = new User({ username, password: hashPassword, roles: [userRole.value] })
			await user.save()
			return res.json({ message: "User was successfully created!" })
		} catch (err) {
			console.log(err)
			res.status(400).json({ message: "Registration error" })
		}
	}
	async login(req, res) {
		try {
			const { username, password } = req.body
			const user = await User.findOne({ username })
			if (!user) {
				return res.status(400).json({ message: "User with this name wasn't found." })
			}
			const validPassword = bcrypt.compareSync(password, user.password)
			if (!validPassword) {
				return res.status(400).json({ message: "Wrong password!" })
			}
			const token = generateAccessToken(user._id, user.roles)
			return res.json({ token })
		} catch (err) {
			console.log(err)
			res.status(400).json({ message: "Login error" })
		}
	}
	async getUsers(req, res) {
		try {
         const users = await User.find()
			res.json(users)
		} catch (err) {
			console.log(err)
		}
	}
}

module.exports = new authController()
