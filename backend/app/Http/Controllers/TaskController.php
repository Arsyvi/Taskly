<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()->latest()->get();

        return response()->json([
            'message' => 'Berhasil mendapatkan Task',
            'tasks' => $tasks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        $task = $request->user()->tasks()->create($validated);

        return response()->json([
            'message' => 'Berhasil membuat Task',
            'task' => $task
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Task $task)
    {
        abort_unless($task->user_id === $request->user()->id, 404);

        return response()->json([
            'task' => $task
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        abort_unless($task->user_id === $request->user()->id, 404);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string|max:255',
            'is_completed' => 'sometimes|boolean'
        ]);

        $task->update($validated);

        return response()->json([
            'message' => 'Task berhasil diupdate',
            'task' => $task
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Task $task)
    {
        abort_unless($task->user_id === $request->user()->id, 404);

        $task->delete();

        return response()->json([
            'message' => 'Task berhasil Dihapus'
        ]);
    }
}
