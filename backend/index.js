import express from 'express'
import cors from 'cors'
import summaryRoute from './routes/summary.route.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json());
app.use('/api/', summaryRoute)

app.listen(PORT, () => {
  console.log(`Server running`);
});
