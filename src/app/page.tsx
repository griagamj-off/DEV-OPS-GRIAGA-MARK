"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Filter = "all" | "active" | "completed";

const starterTasks: Task[] = [
  { id: "assignment", title: "Finish assignment", completed: false },
  { id: "nextjs", title: "Study Next.js", completed: false },
  { id: "git", title: "Set up Git repository", completed: true },
];
const storageKey = "todo-devops-tasks";
const starterTasksSnapshot = JSON.stringify(starterTasks);

function subscribeToTasks(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("todo-devops-tasks", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("todo-devops-tasks", onChange);
  };
}

function getTasksSnapshot() {
  return window.localStorage.getItem(storageKey) ?? starterTasksSnapshot;
}

function getServerTasksSnapshot() {
  return starterTasksSnapshot;
}

function parseTasks(snapshot: string): Task[] {
  try {
    const tasks: unknown = JSON.parse(snapshot);
    if (
      Array.isArray(tasks) &&
      tasks.every(
        (task) =>
          typeof task.id === "string" &&
          typeof task.title === "string" &&
          typeof task.completed === "boolean",
      )
    ) {
      return tasks as Task[];
    }
  } catch {
    return starterTasks;
  }
  return starterTasks;
}

function useTasks() {
  const snapshot = useSyncExternalStore(
    subscribeToTasks,
    getTasksSnapshot,
    getServerTasksSnapshot,
  );
  return parseTasks(snapshot);
}

function updateTasks(update: (current: Task[]) => Task[]) {
  const nextTasks = update(parseTasks(getTasksSnapshot()));
  window.localStorage.setItem(storageKey, JSON.stringify(nextTasks));
  window.dispatchEvent(new Event("todo-devops-tasks"));
}

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All tasks" },
  { value: "active", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export default function Home() {
  const tasks = useTasks();
  const [filter, setFilter] = useState<Filter>("all");
  const [input, setInput] = useState("");

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = input.trim();
    if (!title) return;

    updateTasks((current) => [
      { id: crypto.randomUUID(), title, completed: false },
      ...current,
    ]);
    setInput("");
    setFilter("all");
  }

  function toggleTask(id: string) {
    updateTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: string) {
    updateTasks((current) => current.filter((task) => task.id !== id));
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
  const remaining = tasks.filter((task) => !task.completed).length;

  return (
    <main className="workspace">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Daymark home">
          <span className="wordmark-icon" aria-hidden="true">d.</span>
          <span>daymark</span>
        </a>
        <span className="environment-tag"><span />Development · v1.1</span>
      </header>

      <section className="todo-shell" id="home" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow">A little more room to think</p>
          <h1 id="page-title">My ToDo App <span>— Version 1.1 Development</span></h1>
          <p className="date-line">Make today count, one thing at a time.</p>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <label className="sr-only" htmlFor="new-task">Enter a task</label>
          <input
            id="new-task"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="What needs doing?"
            maxLength={120}
          />
          <button className="add-button" type="submit" disabled={!input.trim()}>
            <span aria-hidden="true">+</span> Add task
          </button>
        </form>

        <div className="list-heading">
          <div>
            <h2>Your list</h2>
            <p>{remaining === 1 ? "1 task left" : `${remaining} tasks left`}</p>
          </div>
          <div className="filter-tabs" role="group" aria-label="Filter tasks">
            {filters.map((item) => (
              <button
                className={filter === item.value ? "filter-button active" : "filter-button"}
                key={item.value}
                onClick={() => setFilter(item.value)}
                type="button"
                aria-pressed={filter === item.value}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="task-list" aria-label="Tasks">
          {visibleTasks.map((task) => (
            <li className={task.completed ? "task-row completed" : "task-row"} key={task.id}>
              <label className="task-label">
                <input
                  aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  type="checkbox"
                />
                <span className="custom-checkbox" aria-hidden="true" />
                <span className="task-title">{task.title}</span>
              </label>
              <button
                aria-label={`Delete ${task.title}`}
                className="delete-button"
                onClick={() => deleteTask(task.id)}
                type="button"
              >
                Delete
              </button>
            </li>
          ))}
          {visibleTasks.length === 0 && (
            <li className="empty-state">
              <span className="empty-mark" aria-hidden="true">✓</span>
              <p>{tasks.length === 0 ? "Your list is clear." : "Nothing here just yet."}</p>
              <span>{tasks.length === 0 ? "Add a task above to get started." : "Try another filter to see your tasks."}</span>
            </li>
          )}
        </ul>

        <footer className="list-footer">
          <span>{tasks.length} {tasks.length === 1 ? "task" : "tasks"} total</span>
          <span>Saved in this browser</span>
        </footer>
      </section>

      <footer className="page-footer">
        <span>Small steps, steady progress.</span>
        <span>Built for today</span>
      </footer>
    </main>
  );
}
