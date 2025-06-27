import express from 'express'
import client from 'prom-client'
import mongoose from 'mongoose'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import 'dotenv/config' 
import userController from './controllers/userController.js'
import textController from './controllers/textController.js'
import questionController from './controllers/questionController.js'
import cors from 'cors'



const app = express()
const port = process.env.PORT || 3000
//these next two are for Grafana monitoring:
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics()
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
})

//middleware
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  if (req.body) {
    mongoSanitize.sanitize(req.body);
  }
  if (req.params) {
    mongoSanitize.sanitize(req.params);
  }
  // avoid req.query entirely
  next();
});

//these next two are for Grafana monitoring:
app.use((req, res, next) => {
  httpRequestsTotal.inc()
  next()
})

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})

app.use(morgan('dev'))


// controllers
app.use('/', userController)
app.use('/', textController)
app.use('/', questionController)


//server connection
const establishServerConnections = async () => {
    try {
        console.log('🔌 MONGODB_URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI)

app.listen(port, () => console.log(`Server up and running on port ${port}`))


    } catch (error) {
        console.log(error)

    }

}
establishServerConnections()