import test from "node:test";
import assert from "node:assert/strict";
import { replaceInList, toggleInList } from "./taskState.js";

test("toggleInList flips only the matching task", () => {
    const first = { id: 1, is_completed: false };
    const second = { id: 2, is_completed: false };
    const tasks = [first, second];

    const result = toggleInList(tasks, first);

    assert.equal(result[0].is_completed, true);
    assert.equal(result[1].is_completed, false);
    assert.notEqual(result[0], first);
    assert.equal(result[1], second);
    assert.notEqual(result, tasks);
});

test("replaceInList restores the task when a toggle fails", () => {
    const task = { id: 1, title: "A", is_completed: false };
    const other = { id: 2, title: "B", is_completed: true };
    const optimistic = toggleInList([task, other], task);

    const restored = replaceInList(optimistic, task);

    assert.deepEqual(restored, [task, other]);
});

test("replaceInList swaps only the updated task", () => {
    const task = { id: 1, title: "A", is_completed: false };
    const other = { id: 2, title: "B", is_completed: true };
    const updated = { ...task, is_completed: true };

    const result = replaceInList([task, other], updated);

    assert.equal(result[0], updated);
    assert.equal(result[1], other);
});
