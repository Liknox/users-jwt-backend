const jwt = require("jsonwebtoken")
const { secret } = require("../config")

module.exports = function (roles) {
	return (req, res, next) => {
		if (req.method === "OPTIONS") {
			next()
		}
		try {
			const token = req.headers.authorization?.split(" ")[1]
			if (!token) {
				return res.status(400).json({ message: "User isn't authorized!" })
			}
			const { roles: userRoles } = jwt.verify(token, secret)
			let hasRole = false
			userRoles.forEach(role => {
				if (roles.includes(role)) {
					hasRole = true
				}
			})
			if (!hasRole) {
				return res.status(400).json({ message: "You don't have an access!" })
			}
			next()
		} catch (err) {
			console.log(err)
			return res.status(400).json({ message: "User isn't authorized!" })
		}
	}
}
