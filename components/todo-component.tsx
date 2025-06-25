"use client";
import { ITodo } from "@/types/todo";
import React from "react";
import { CheckCircleIcon, TrashIcon, XCircleIcon } from "lucide-react";
import BackButton from "./back-button";
import { addTodo, deleteTodo, updateTodo } from "@/lib/data";
import { revalidateClientPath } from "@/lib/actions";
import toast from "react-hot-toast";

interface TodoComponentProps {
  todos: ITodo[];
}

const TodoComponent: React.FC<TodoComponentProps> = ({ todos }) => {
  const [newTodoText, setNewTodoText] = React.useState("");

  const onAddTodo = async (todo: Partial<ITodo>) => {
    const createMsg = toast.loading("Cargando...");
    try {
      const response = await addTodo(
        todo as Omit<ITodo, "id" | "userId" | "createdAt" | "updatedAt">
      );
      if (!response) {
        return;
      }
      revalidateClientPath("/todos");
      toast.success("Tarea agregada con exito 🌚");
    } catch (error) {
      console.error("Error agregando la tarea:", error);
    } finally {
      toast.dismiss(createMsg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo({
        text: newTodoText,
        completed: false,
      });
      setNewTodoText("");
    }
  };

  const onToggleTodo = async (id: string) => {
    const toggleMsg = toast.loading("Cargando...");
    try {
      console.log(!todos.find((todo) => todo.id === id)?.completed)
      const response = await updateTodo(id, {
        completed: !todos.find((todo) => todo.id === id)?.completed,
      });
      if (!response) {
        return;
      }
      revalidateClientPath("/todos");
      toast.success("Tarea actualizada con exito 🌚");
    } catch (error) {
      console.error("Error actualizando la tarea:", error);
    } finally {
      toast.dismiss(toggleMsg);
    }
  };
  const onDeleteTodo = async (id: string) => {
    const deleteMsg = toast.loading("Cargando...");
    try {
      console.log(id)
      const response = await deleteTodo(id);
      if (!response) {
        return;
      }
      revalidateClientPath("/todos");
      toast.success("Tarea eliminada con exito 🌚");
    } catch (error) {
      console.error("Error eliminando la tarea:", error);
    } finally {
      toast.dismiss(deleteMsg);
    }
  };
  return (
    <>
      <BackButton href="/" />
      <div className="max-w-2xl mx-auto px-4 pt-16">
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Nueva tarea..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-olive-500 text-white rounded-lg hover:bg-olive-600 transition-colors"
            >
              Agregar
            </button>
          </form>
        </div>
        {/* <h1 className="text-2xl font-bold mb-6">Tareas</h1> */}
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-all ${
                todo.completed ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onToggleTodo(todo.id)}
                  className={`p-2 rounded-full transition-colors ${
                    todo.completed
                      ? "bg-olive-100 text-olive-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {todo.completed ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <XCircleIcon className="w-5 h-5" />
                  )}
                </button>
                <span
                  className={`text-gray-800 ${
                    todo.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TodoComponent;
