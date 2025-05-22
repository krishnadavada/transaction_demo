const express = require('express')
const app = express()
const dotenv=require('dotenv')
const connectDb = require('./db')
dotenv.config()
const nPort = process.env.PORT || 4000
const authRoute=require('./routes/authRoute')
const passBookRoute=require('./routes/passBooKRoute')
const {oStatus,oMessage,createResponse}=require('./helper/response')
const cookieParser = require('cookie-parser')


app.use(express.json())
app.use(cookieParser())

app.use("/auth",authRoute)
app.use("/passbook",passBookRoute)

connectDb()

app.get("/health", (req, res) => {
    return createResponse(res, oStatus.OK, oMessage.server_up);
});

app.listen(nPort, () => console.log(`App listening on http://localhost:${nPort}`))