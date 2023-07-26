const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const authRouter = require("./authRouter.js")

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use("/auth", authRouter)

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO)
		app.listen(PORT, () => console.log(`Server is successfully started on ${PORT} port.`))
	} catch (err) {
		console.log(err)
	}
}

start()
