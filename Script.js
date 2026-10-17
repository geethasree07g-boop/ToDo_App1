// ==========================================
// TO-DO APPLICATION
// ==========================================


// Get HTML elements

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const taskTime = document.getElementById("taskTime");

const taskList = document.getElementById("taskList");

const emptyMessage = document.getElementById("emptyMessage");

const clearBtn = document.getElementById("clearBtn");

const themeBtn = document.getElementById("themeBtn");

const greeting = document.getElementById("greeting");

const todayDate = document.getElementById("todayDate");

const quote = document.getElementById("quote");


// ==========================================
// TASK ARRAY
// ==========================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ==========================================
// QUOTES
// ==========================================

const quotes = [

    "Believe in yourself and keep learning.",

    "Small progress is still progress.",

    "Success comes from consistent effort.",

    "Don't stop learning.",

    "Practice makes you better.",

    "Every expert was once a beginner.",

    "Your future depends on what you do today."

];


// ==========================================
// DISPLAY DATE
// ==========================================

function displayDate() {

    const today = new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    todayDate.textContent =
        today.toLocaleDateString("en-IN", options);
}


// ==========================================
// DISPLAY GREETING
// ==========================================

function displayGreeting() {

    const hour = new Date().getHours();

    let message;


    if (hour < 12) {

        message = "Good Morning, User!";

    } else if (hour < 17) {

        message = "Good Afternoon, User!";

    } else {

        message = "Good Evening, User!";

    }


    greeting.textContent = message;
}


// ==========================================
// DISPLAY RANDOM QUOTE
// ==========================================

function displayQuote() {

    const randomIndex =
        Math.floor(Math.random() * quotes.length);

    quote.textContent =
        quotes[randomIndex];
}


// ==========================================
// DISPLAY TASKS
// ==========================================

function displayTasks() {

    taskList.innerHTML = "";


    if (tasks.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }


    emptyMessage.style.display = "none";


    tasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task-item";


        if (task.completed) {

            li.classList.add("completed");

        }


        // Task content

        const taskContent =
            document.createElement("div");

        taskContent.className =
            "task-content";


        const taskName =
            document.createElement("div");

        taskName.className =
            "task-name";

        taskName.textContent =
            task.name;


        const taskTimeElement =
            document.createElement("div");

        taskTimeElement.className =
            "task-time";


        if (task.time) {

            taskTimeElement.textContent =
                "⏰ " + task.time;

        } else {

            taskTimeElement.textContent =
                "No time selected";

        }


        taskContent.appendChild(taskName);

        taskContent.appendChild(taskTimeElement);


        // Buttons

        const buttons =
            document.createElement("div");

        buttons.className =
            "task-buttons";


        const completeButton =
            document.createElement("button");

        completeButton.className =
            "complete-btn";

        completeButton.textContent =
            task.completed
                ? "Undo"
                : "Done";


        completeButton.addEventListener(
            "click",
            function() {

                toggleTask(task.id);

            }
        );


        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-btn";

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            function() {

                deleteTask(task.id);

            }
        );


        buttons.appendChild(completeButton);

        buttons.appendChild(deleteButton);


        // Add everything to li

        li.appendChild(taskContent);

        li.appendChild(buttons);


        taskList.appendChild(li);

    });
}


// ==========================================
// ADD TASK
// ==========================================

taskForm.addEventListener(
    "submit",
    function(event) {

        // Stop page refresh

        event.preventDefault();


        const taskName =
            taskInput.value.trim();

        const time =
            taskTime.value;


        // Validation

        if (taskName === "") {

            alert("Please enter a task.");

            return;

        }


        // Create task object

        const newTask = {

            id: Date.now(),

            name: taskName,

            time: time,

            completed: false

        };


        // Add task to array

        tasks.push(newTask);


        // Save

        saveTasks();


        // Display

        displayTasks();


        // Clear form

        taskInput.value = "";

        taskTime.value = "";

    }
);


// ==========================================
// SAVE TASKS
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// ==========================================
// COMPLETE / UNCOMPLETE TASK
// ==========================================

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            task.completed =
                !task.completed;

        }

        return task;

    });


    saveTasks();

    displayTasks();
}


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(id) {

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();
}


// ==========================================
// CLEAR ALL TASKS
// ==========================================

clearBtn.addEventListener(
    "click",
    function() {

        if (tasks.length === 0) {

            alert("There are no tasks.");

            return;

        }


        const confirmDelete =
            confirm(
                "Are you sure you want to delete all tasks?"
            );


        if (confirmDelete) {

            tasks = [];

            saveTasks();

            displayTasks();

        }

    }
);


// ==========================================
// DARK / LIGHT MODE
// ==========================================

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            themeBtn.textContent =
                "☀️ Light Mode";

            localStorage.setItem(
                "theme",
                "dark"
            );

        } else {

            themeBtn.textContent =
                "🌙 Dark Mode";

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);


// ==========================================
// LOAD SAVED THEME
// ==========================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent =
            "☀️ Light Mode";

    }

}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

displayDate();

displayGreeting();

displayQuote();

displayTasks();

loadTheme();