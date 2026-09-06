import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRoute from './routes/userRoute.js'

// app initialization
const app = express()
connectCloudinary()

// middleware
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use('/api', async (req, res, next) => {
  try { await connectDB(); next(); }
  catch { res.status(503).json({ success: false, message: 'Service temporarily unavailable. Please try again.' }); }
}) 

// api routes
app.use('/api/admin', adminRouter)
app.use('/api/doctors', doctorRouter)
app.use('/api/user', userRoute)

app.get('/', (req, res) => {
  res.send('Welcome to the Prescripto API')
})

// 🚀 Do NOT listen to a port in Vercel
export default app
