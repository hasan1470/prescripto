import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRoute from './routes/userRoute.js'


// app initialization
const app = express()
connectDB()
connectCloudinary()

// middleware
app.use(cors())
app.use(express.json()) 

// api routes

app.use('/api/admin', adminRouter)
app.use('/api/doctors', doctorRouter)
app.use('/api/user', userRoute)


app.get('/', (req, res) => {
  res.send('Welcome to the Prescripto API')
})

