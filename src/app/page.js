"use client"
import { deleteCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TodoList() {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState('');
  const [currentIndex, setCurrentIndex] = useState(null);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const editTodo = (index) => {
    setIsEditing(true);
    setCurrentTodo(todos[index]);
    setCurrentIndex(index);
  };

  const updateTodo = () => {
    if (currentTodo.trim() !== '') {
      const updatedTodos = todos.map((todo, index) =>
        index === currentIndex ? currentTodo : todo
      );
      setTodos(updatedTodos);
      setIsEditing(false);
      setCurrentTodo('');
      setCurrentIndex(null);
    }
  };

  const logout = async (event) => {
    event.preventDefault();
    const respomse = deleteCookie('token');
    console.info("User logged out");
    return router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">TODO List</h1>
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
            onClick={logout}
          >
            Logout
          </button>
        </header>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow p-3 border rounded-l text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={isEditing ? currentTodo : newTodo}
            onChange={(e) => isEditing ? setCurrentTodo(e.target.value) : setNewTodo(e.target.value)}
            placeholder={isEditing ? "Edit task" : "Add a new task"} />
          <button
            className="bg-blue-500 text-white p-3 rounded-r hover:bg-blue-600 transition duration-300"
            onClick={isEditing ? updateTodo : addTodo}
          >
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {todos.map((todo, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-3 hover:bg-gray-50 transition duration-300"
            >
              <span className="text-gray-700">{todo}</span>
              <div>
                <button
                  className="text-blue-500 mr-2 hover:text-blue-700 transition duration-300"
                  onClick={() => editTodo(index)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:text-red-700 transition duration-300"
                  onClick={() => removeTodo(index)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}