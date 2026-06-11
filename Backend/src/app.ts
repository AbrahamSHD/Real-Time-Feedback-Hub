import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import messagesRouter from './routes/messages'
import userRoutes from './routes/users';

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API running' })
})

app.use('/api/users', userRoutes);
app.use('/api/messages', messagesRouter)

export default app