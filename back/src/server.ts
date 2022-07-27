import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import path from 'path'
import { AppLogger } from 'app/services/Logger'

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
const app = express()

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(cors(corsOptions));

app.use(cors())
app.options('*', cors())

// parse requests of content-type - application/json
app.use(express.json({ limit: '25mb' }))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '25mb' }))

// simple route
app.use(express.static(path.join(__dirname, '../front/build')))
app.use('/uploads', express.static('./../uploads'))
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

require('./app/routes/user.routes')(app)
require('./app/routes/auth.routes')(app)
require('./app/routes/cryptocurrency.routes')(app)
require('./app/routes/dvpn.routes')(app)
require('./app/routes/kyc.routes')(app)
require('./app/routes/kycAdmin.routes')(app)

// set port, listen for requests
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  AppLogger.log(`Server is running on port ${PORT}.`)
})

require('interval.jobs')
