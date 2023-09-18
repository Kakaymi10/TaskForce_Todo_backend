import express from "express";
import bodyParser from 'body-parser'
import usersRoutes from './routes/todos.js'
const app = express();
const PORT = 5000;

app.use(bodyParser.json())
app.use('/todos', usersRoutes)
app.get('/', (req, res)=>{
    console.log('[TEST]')
    res.send('Hello from Home page')
});
app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`))

export default app
