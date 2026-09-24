require('dotenv').config()

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || 5000

const registrationSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  department: { type: String, required: true },
  gender: { type: String, required: true },
  year: { type: String, required: true },
  section: { type: String, required: true },
  arrears: { type: String, required: true },
  companies: { type: [String], required: true },
}, { timestamps: true })

const Registration = mongoose.model('Registration', registrationSchema)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})

app.post('/api/registrations', async (request, response) => {
  try {
    const registration = await Registration.create(request.body)
    response.status(201).json(registration)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  })