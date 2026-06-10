import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import messagesRouter from './routes/messages'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API running' })
})

app.use('/api/messages', messagesRouter)

export default app