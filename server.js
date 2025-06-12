import express from 'express'
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

app.use(morgan('dev'))


// controllers
app.use('/', userController)
app.use('/', textController)
app.use('/', questionController)


//server connection
const establishServerConnections = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

app.listen(port, () => console.log(`Server up and running on port ${port}`))


    } catch (error) {
        console.log(error)

    }

}
establishServerConnections()