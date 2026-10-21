// Pure list updates so optimistic toggle/rollback can be tested without React.
export function toggleInList(tasks, task) {
    const next = !task.is_completed
    return tasks.map((t) => (t.id === task.id ? { ...t, is_completed: next } : t))
}

export function replaceInList(tasks, task) {
    return tasks.map((t) => (t.id === task.id ? task : t))
}
