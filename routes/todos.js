import express from "express";
import {v4 as uuidv4} from 'uuid'

const router = express.Router()

let todos = [{
    "todo_name": "Moussaaer",
    "description": "Moustaphall_g"
}]
let bin = []


// Define a function to validate the input fields
function validateInput(todo) {
    return todo && todo.todo_name && todo.description;
}


// Create a new Todo object with automatic creation date
function createTodoWithDate(todo) {
    const newUserId = uuidv4();
    const creationDate = new Date().toISOString();
    return { ...todo, id: newUserId, creation_date: creationDate };
}

router.get('/', (req, res) =>{
    console.log(todos)
    if(todos.length == 0){
        res.send('No Todo')
    }else{
        res.send(todos)
    }
})
router.get('/bin', (req, res) =>{
    console.log(bin)
    if(bin.length == 0){
        res.send('No Todo in the bin')
    }else{
        res.send(bin)
    }
})

// POST route with input validation and creation date
router.post('/', (req, res) => {
    const todo = req.body;
    
    // Check if the 'todo_name' already exists in 'todos'
    if (todos.some(existingTodo => existingTodo.todo_name === todo.todo_name)) {
        res.status(400).send('Todo with the same name already exists.');
        return; // Exit the route
    }

    // Check if the input fields are valid
    if (validateInput(todo)) {
        // Ensure no additional keys are present in the request body
        const validKeys = ['todo_name', 'description'];
        const extraKeys = Object.keys(todo).filter(key => !validKeys.includes(key));
        
        if (extraKeys.length > 0) {
            res.status(400).send('Invalid input. Only todo_name and description are allowed.');
        } else {
            const newTodo = createTodoWithDate(todo);
            todos.push(newTodo);

            res.send(`Todo with the name ${newTodo.todo_name} added to the database with id ${newTodo.id}`);
        }
    } else {
        res.status(400).send('Invalid input. Please provide valid todo_name and description.');
    }
});



router.get('/:id', (req, res) => {
    const { id } = req.params;
     // Convert the id parameter to a number
    const foundUser = todos.find(todo => todo.id === id);
    
    if (foundUser) {
        res.send(foundUser);
    } else {
        res.send('Todo not found with the provided id');
    }
   
});
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Use findIndex to get the index of the todo with the matching ID
    const foundIndex = todos.findIndex(todo => todo.id === id);

    // Check if a todo with the provided ID was found
    if (foundIndex !== -1) {
        const deletedTodo = todos.splice(foundIndex, 1)[0]; // Remove and capture the todo
        deletedTodo.deleted_at = new Date().toISOString(); // Add 'deleted_at' timestamp
        bin.push(deletedTodo); // Push the removed todo to the bin array
        res.send(`Todo with the id ${id} deleted from the db`);
    } else {
        res.send(`No todo found with the id ${id}`);
    }
});


router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { todo_name, description } = req.body;

    const todo = todos.find((todo) => todo.id === id);

    if (todo_name) todo.todo_name = todo_name;
    if (description) todo.description = description;

    // Update the 'updated_at' property to the current timestamp
    todo.updated_at = new Date().toISOString();

    res.send(`Todo with the id ${id} has been updated`);
});



export default router