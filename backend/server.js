import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js';
import { UserRouter } from './routes/userRoutes.js';
import { todosRouter } from './routes/todosRoutes.js';

const app = express();
const port = 5000;

app.use(express.json())
app.use(cors())

//database connection
connectDB();

//api endpoints
app.use('/api/user', UserRouter);
app.use('/api/todos', todosRouter)

app.get('/', (req,res)=>{
    res.send("Server Live....")
})

app.listen(port, (req,res)=>{
    console.log(`Server is running on ${port}`);
})