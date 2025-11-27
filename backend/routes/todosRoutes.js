import express from 'express'
import { addTodo, deleteTodo, getTodos, updateTodo } from '../controller/addTodos.js';

export const todosRouter = express.Router();

todosRouter.post('/add', addTodo);
todosRouter.delete('/delete', deleteTodo);
todosRouter.post('/get', getTodos);
todosRouter.put('/update', updateTodo);

