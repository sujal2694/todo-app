import TodoModel from "../model/todoModel.js";

export const addTodo = async (req, res) => {
  try {
    const { title, userId } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.json({ success: false, message: "Title is required" });
    }

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Create new todo
    const newTodo = new TodoModel({
      title: title.trim(),
      userId: userId,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const todo = await newTodo.save();
    res.json({ success: true, message: "Todo added successfully", todo });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding todo" });
  }
};

export const getTodos = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const todos = await TodoModel.find({ userId });
    res.json({ success: true, todos });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching todos" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { todoId, title, completed } = req.body;

    if (!todoId) {
      return res.json({ success: false, message: "Todo ID is required" });
    }

    const updatedTodo = await TodoModel.findByIdAndUpdate(
      todoId,
      { title, completed, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedTodo) {
      return res.json({ success: false, message: "Todo not found" });
    }

    res.json({ success: true, message: "Todo updated successfully", updatedTodo });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating todo" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.body;

    if (!todoId) {
      return res.json({ success: false, message: "Todo ID is required" });
    }

    const deletedTodo = await TodoModel.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return res.json({ success: false, message: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting todo" });
  }
};