
"use strict";

// Get HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskTimeInput = document.getElementById("taskTime");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");
const greeting = document.getElementById("greeting");
const todayDate = document.getElementById("todayDate");
const quote = document.getElementById("quote");

const STORAGE_KEY = "todo-app-tasks";
const THEME_KEY = "todo-app-theme";

const quotes = [
  "Believe in yourself and keep learning.",
  "Small progress is still progress.",
  "Success comes from consistent effort.",
  "Don't stop learning.",
  "Practice makes you better.",
  "Every expert was once a beginner.",
  "Your future depends on what you do today."
];

// Load saved tasks safely
function readSavedTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Could not load saved tasks:", error);
    return [];
  }
}

let tasks = readSavedTasks();

// Save tasks in browser storage
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn("Could not save tasks:", error);
    alert("Your browser could not save tasks. Check browser storage settings.");
  }
}

// Show today's date
function displayDate() {
  todayDate.textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// Show greeting
function displayGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    greeting.textContent = "Good morning! Ready to plan your day?";
  } else if (hour < 17) {
    greeting.textContent = "Good afternoon! Keep making progress.";
  } else {
    greeting.textContent = "Good evening! Let's organize your tasks.";
  }
}

// Show a random quote
function displayQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  quote.textContent = quotes[index];
}

// Display all tasks
function displayTasks() {
  taskList.replaceChildren();
  emptyMessage.hidden = tasks.length > 0;

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    const content = document.createElement("div");
    content.className = "task-content";

    const name = document.createElement("div");
    name.className = "task-name";
    name.textContent = task.name;

    const time = document.createElement("div");
    time.className = "task-time";
    time.textContent = task.time
      ? `⏰ ${task.time}`
      : "No time selected";

    content.append(name, time);

    const buttons = document.createElement("div");
    buttons.className = "task-buttons";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className = "complete-btn";
    completeButton.textContent = task.completed ? "Undo" : "Done";
    completeButton.addEventListener("click", () => toggleTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    buttons.append(completeButton, deleteButton);
    li.append(content, buttons);
    taskList.appendChild(li);
  });
}

// Add a new task
taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = taskInput.value.trim();
  const time = taskTimeInput.value;

  if (!name) {
    alert("Please enter a task.");
    taskInput.focus();
    return;
  }

  tasks.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    time,
    completed: false
  });

  saveTasks();
  displayTasks();
  taskForm.reset();
  taskInput.focus();
});

// Mark task completed or undo completion
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasks();
  displayTasks();
}

// Delete one task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  displayTasks();
}

// Clear all tasks
clearBtn.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("There are no tasks to clear.");
    return;
  }

  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveTasks();
    displayTasks();
  }
});

// Apply light or dark theme
function applyTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark", isDark);
  themeBtn.textContent = isDark
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";

  themeBtn.setAttribute("aria-pressed", String(isDark));
}

// Switch theme when button is clicked
themeBtn.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark")
    ? "light"
    : "dark";

  applyTheme(nextTheme);

  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch (error) {
    console.warn("Could not save theme preference:", error);
  }
});

// Load saved theme
function loadTheme() {
  try {
    applyTheme(localStorage.getItem(THEME_KEY) || "light");
  } catch (error) {
    applyTheme("light");
  }
}

// Initialize application
displayDate();
displayGreeting();
displayQuote();
loadTheme();
displayTasks();
