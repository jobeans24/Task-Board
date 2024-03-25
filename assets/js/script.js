// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || {};
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to access the innerHTML on line 47
function accessInnerHTML() {
  const laneElement = document.getElementById("todo");
  const innerHTML = laneElement.innerHTML;
  console.log(innerHTML);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.classList.add("task-card");
  taskCard.dataset.dueDate = task.dueDate;

  const taskTitle = document.createElement("h3");
  taskTitle.textContent = task.title;
  taskCard.appendChild(taskTitle);

  const taskDescription = document.createElement("p");
  taskDescription.textContent = task.description;
  taskCard.appendChild(taskDescription);

  const taskDueDate = document.createElement("p");
  taskDueDate.textContent = task.dueDate;
  taskCard.appendChild(taskDueDate);

  // Change task card color based on due date
  const currentDate = new Date();
  const dueDate = new Date(task.dueDate);
  const timeDifference = dueDate.getTime() - currentDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  if (daysDifference <= 0) {
    taskCard.style.backgroundColor = "red";
  } else if (daysDifference <= 7) {
    taskCard.style.backgroundColor = "yellow";
  }

  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const lanes = ["todo", "inProgress", "done"];
  lanes.forEach(lane => {
    const laneElement = document.getElementById(lane);
    laneElement.innerHTML = "";
    taskList[lane].forEach(task => {
      const taskCard = createTaskCard(task);
      taskCard.dataset.id = task.id;
      $(taskCard).draggable();
      laneElement.appendChild(taskCard);
    });
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  // implementation here
  event.preventDefault();
  const title = $("#title").val().trim();
  const description = $("#description").val().trim();
  const dueDate = $("#due-date").val().trim();
  const newTask = {
    id: generateTaskId(),
    title: title,
    description: description,
    dueDate: dueDate
  };
  taskList.todo.push(newTask);
  renderTaskList();
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", nextId);
  $("#title").val("");
  $("#description").val("");
  $("#due-date").val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  // implementation here
  event.stopPropagation();
  const taskId = $(this).closest(".task-card").data("id");
  const lane = $(this).closest(".lane").attr("id");
  taskList[lane] = taskList[lane].filter(task => task.id !== taskId);
  renderTaskList();
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // implementation here
  const taskId = ui.draggable.data("id");
  const lane = $(this).attr("id");
  const task = taskList.todo.find(task => task.id === taskId);
  taskList.todo = taskList.todo.filter(task => task.id !== taskId);
  taskList[lane].push(task);
  renderTaskList();
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();
  $(".task-card").on("click", handleDeleteTask);
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop
  });
  $("#due-date").datepicker();
});


