const jwt = require("jsonwebtoken")
const { secret } = require("../config.js")

module.exports = function (req, res, next) {
	if (req.method === "OPTIONS") {
		next()
	}

	try {
		const token = req.headers.authorization?.split(" ")[1]
		if (!token) {
			return res.status(400).json({ message: "User isn't authorized!" })
		}
		const decodeData = jwt.verify(token, secret)
		req.user = decodeData
		next()
	} catch (err) {
		console.log(err)
		return res.status(400).json({ message: "User isn't authorized!" })
	}
}
