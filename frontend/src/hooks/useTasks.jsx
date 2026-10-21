import { useCallback, useState } from "react";
import api from "../services/api";
import { replaceInList, toggleInList } from "./taskState";

export function useTasks() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchTasks = useCallback( async () => {
        try {
            const response = await api.get("/tasks")
            setTasks(response.data.tasks)
            setError(false)
        }
        catch (err) {
            setError(true)
            throw err
        }
        finally{
            setLoading(false)
        }
    },[])

    const addTask = useCallback( async(title, description)=> {
        const response = await api.post("/tasks", {title, description})
        setTasks((prev)=>[response.data.task, ...prev])
    },[])

    const toggleTask = useCallback( async(task)=> {
        // Optimistic: layar langsung berubah, server menyusul.
        setTasks((prev)=> toggleInList(prev, task))
        try {
            const response = await api.patch(`/tasks/${task.id}`, { is_completed: !task.is_completed });
            setTasks((prev)=> replaceInList(prev, response.data.task))
        } catch (err) {
            // shortcut: double-click cepat bisa membuat rollback menimpa state terbaru, disable tombol per-task kalau ini jadi masalah.
            setTasks((prev)=> replaceInList(prev, task))
            throw err
        }
    },[])

    const deleteTask = useCallback( async(id)=> {
        await api.delete(`/tasks/${id}`)
        setTasks((prev)=> prev.filter((t)=> t.id !== id))
    },[])

    return {tasks, fetchTasks, addTask, toggleTask, deleteTask, loading, error}
}
