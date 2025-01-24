import express from 'express'
import cors from 'cors'
import summaryRoute from './routes/summary.route.js'
import userRoute from './routes/user.route.js'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

dotenv.config()

const jwtSecret = process.env.JWT_SECRET

const app = express();
const PORT = process.env.PORT || 5000;

connectDB()

app.use(cors())
app.use(express.json());
app.use((req, res, next) => {
  req.jwtSecret = jwtSecret;
  next();
});
app.use('/api/', summaryRoute)
app.use('/api/users/', userRoute)

app.listen(PORT, () => {
  console.log(`Server running`);
});
