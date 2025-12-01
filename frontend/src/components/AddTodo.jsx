import React, { useContext, useState, useEffect } from 'react'
import { Context } from '../context/context'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddTodo = () => {
    const { url, token, loading, setLoading, todos, setTodos } = useContext(Context);
    const [todoInput, setTodoInput] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editInput, setEditInput] = useState("");

    const onChangeHandler = (event) => {
        setTodoInput(event.target.value);
    }

    const getUserIdFromToken = () => {
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            if (!payload) return null;
            const decoded = JSON.parse(atob(payload));
            return decoded.id || decoded._id || decoded.userId || null;
        } catch (error) {
            console.log("Token parse error:", error);
            return null;
        }
    };

    const fetchTodos = async () => {
        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                setTodos([]);
                return;
            }
            const response = await axios.post(`${url}/api/todos/get`, { userId });
            if (response.data?.success) {
                setTodos(response.data.todos || []);
            } else {
                toast.error(response.data?.message || "Failed to fetch todos");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching todos");
        }
    };

    const addTodoHandler = async (e) => {
        e.preventDefault();
        const title = (todoInput || "").trim();
        if (!title) {
            toast.error("Please enter a todo title");
            return;
        }
        try {
            setLoading(true);
            const userId = getUserIdFromToken();
            if (!userId) {
                toast.error("User not authenticated");
                return;
            }
            const response = await axios.post(`${url}/api/todos/add`, {
                title,
                userId
            });
            if (response.data?.success) {
                toast.success(response.data.message || "Todo added");
                setTodoInput("");
                fetchTodos();
            } else {
                toast.error(response.data?.message || "Unable to add todo");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error adding todo");
        } finally {
            setLoading(false);
        }
    };

    const deleteTodoHandler = async (todoId) => {
        try {
            const response = await axios.delete(`${url}/api/todos/delete`, {
                data: { todoId }
            });
            if (response.data?.success) {
                toast.success(response.data.message || "Deleted");
                fetchTodos();
            } else {
                toast.error(response.data?.message || "Unable to delete");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting todo");
        }
    };

    const updateTodoHandler = async (todoId, completed, title) => {
        try {
            const body = { todoId };
            if (typeof completed === 'boolean') body.completed = completed;
            if (typeof title === 'string' && title.trim()) body.title = title.trim();

            const response = await axios.put(`${url}/api/todos/update`, body);
            if (response.data?.success) {
                toast.success(response.data.message || "Updated");
                if (title !== undefined) {
                    setEditingId(null);
                    setEditInput("");
                }
                fetchTodos();
            } else {
                toast.error(response.data?.message || "Unable to update");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error updating todo");
        }
    };

    const startEdit = (todo) => {
        setEditingId(todo._id);
        setEditInput(todo.title || "");
    }

    const cancelEdit = () => {
        setEditingId(null);
        setEditInput("");
    }

    const submitEdit = (e, todo) => {
        e.preventDefault();
        const newTitle = (editInput || "").trim();
        if (!newTitle) {
            toast.error("Title cannot be empty");
            return;
        }
        updateTodoHandler(todo._id, todo.completed, newTitle);
    }

    useEffect(() => {
        if (token && url) {
            fetchTodos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, url]);

    const totalTasks = Array.isArray(todos) ? todos.length : 0;
    const completedTasks = Array.isArray(todos) ? todos.filter(t => t.completed).length : 0;
    const pendingTasks = totalTasks - completedTasks;

    return (
        <div className='bg-white rounded-2xl w-[90vw] lg:w-[70vw] 2xl:w-[70vw] md:w-[80vw] m-auto mt-10 p-6 mb-10 shadow-2xl'>
            <div className='flex items-center gap-2'>
                <form onSubmit={addTodoHandler} className='w-full flex gap-2'>
                    <input
                        name='title'
                        value={todoInput}
                        onChange={onChangeHandler}
                        type="text"
                        placeholder='What needs to be done?'
                        className='w-full h-12 border border-gray-500/40 rounded-md pl-3'
                        required
                    />
                    <button
                        type='submit'
                        disabled={loading}
                        className='px-6 py-3 bg-blue-600 text-white font-semibold rounded-md disabled:opacity-50'
                    >
                        {loading ? "Adding..." : "Add"}
                    </button>
                </form>
            </div>

            <div className='flex items-center gap-2 mt-1'>
                <input type="checkbox" className='w-4' />
                <p className='text-sm'>Repeat this task daily</p>
            </div>

            <div className='flex items-center justify-center gap-3 mt-5'>
                <div className='bg-blue-500/10 rounded-md p-3 flex-1'>
                    <p className='text-xl font-semibold'>{totalTasks}</p>
                    <span className='text-sm text-blue-500'>Total Tasks</span>
                </div>
                <div className='bg-green-500/10 rounded-md p-3 flex-1'>
                    <p className='text-xl font-semibold'>{completedTasks}</p>
                    <span className='text-sm text-green-500'>Completed</span>
                </div>
                <div className='bg-orange-500/10 rounded-md p-3 flex-1'>
                    <p className='text-xl font-semibold'>{pendingTasks}</p>
                    <span className='text-sm text-orange-500'>Pending</span>
                </div>
            </div>

            {Array.isArray(todos) && todos.length > 0 ? (
                todos.map((todo) => (
                    <div key={todo._id} className='flex items-center justify-between px-4 py-5 rounded-md bg-gray-300/10 mt-4'>
                        <div className='flex items-center gap-3'>
                            <input
                                type="checkbox"
                                className='w-5 h-5 accent-blue-400'
                                checked={!!todo.completed}
                                onChange={() => updateTodoHandler(todo._id, !todo.completed)}
                            />
                            {editingId === todo._id ? (
                                <form onSubmit={(e) => submitEdit(e, todo)} className='flex items-center gap-2'>
                                    <input
                                        value={editInput}
                                        onChange={(e) => setEditInput(e.target.value)}
                                        type="text"
                                        className='border rounded-md pl-2 h-10'
                                        autoFocus
                                    />
                                    <button type='submit' className='px-3 py-1 bg-green-600 text-white rounded-md'>
                                        Save
                                    </button>
                                    <button 
                                        type='button' 
                                        onClick={cancelEdit} 
                                        className='px-3 py-1 bg-gray-300 rounded-md'
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <p className={`text-md ${todo.completed ? 'line-through text-gray-400' : 'text-zinc-800'}`}>
                                    {todo.title}
                                </p>
                            )}
                        </div>
                        <div className='flex items-center gap-5'>
                            {editingId !== todo._id && (
                                <>
                                    <i 
                                        className='bx bx-pencil text-2xl text-gray-500 cursor-pointer hover:text-blue-600' 
                                        onClick={() => startEdit(todo)}
                                    ></i>
                                    <i
                                        className='bx bx-trash text-2xl text-gray-500 cursor-pointer hover:text-red-600'
                                        onClick={() => deleteTodoHandler(todo._id)}
                                    ></i>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className='flex items-center justify-center flex-col mt-16 mb-16'>
                    <i className='bx bx-check-circle text-5xl text-gray-400 mb-3'></i>
                    <h2 className='text-md text-gray-400'>No todos yet</h2>
                    <p className='text-sm text-gray-400'>Create one to get started!</p>
                </div>
            )}
        </div>
    )
}

export default AddTodo