// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

let statusLanes = ["To Do", "In Progress", "Done"];

// If taskList is null, set it to an empty array
if (!taskList) {
    taskList = [];
}

// If nextId is null, set it to 1
if (!nextId) {
    nextId = 1;
}


// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let card = $("<div>").addClass("card").attr("id", task.id);
    let cardBody = $("<div>").addClass("card-body");
    let cardTitle = $("<h5>").addClass("card-title").text(task.title);
    let cardText = $("<p>").addClass("card-text").text(task.description);
    let cardFooter = $("<div>").addClass("card-footer text-muted");
    let dueDate = $("<small>").addClass("text-muted").text(task.dueDate);
    let deleteButton = $("<button>").addClass("btn btn-danger").text("Delete");

    cardBody.append(cardTitle, cardText);
    cardFooter.append(dueDate, deleteButton);
    card.append(cardBody, cardFooter);

    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#toDo").empty();
    $("#inProgress").empty();
    $("#done").empty();

    taskList.forEach(task => {
        let card = createTaskCard(task);
        $("#" + task.status).append(card);
        $("#" + task.id).draggable({
            revert: "invalid",
            helper: "clone"
        });
    });  

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let title = $("#title").val();
    let description = $("#description").val();
    let dueDate = $("#dueDate").val();
    let status = "To Do";

    let task = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        status: status
    };

    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(this).parent().parent().attr("id");
    taskList = taskList.filter(task => task.id != taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr("id");
    let newStatus = $(this).attr("id");
    let task = taskList.find(task => task.id == taskId);
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#addTask").on("click", handleAddTask);
    $(document).on("click", ".btn-danger", handleDeleteTask);
    $(".lane").droppable({
        drop: handleDrop
    });
    $("#dueDate").datepicker();
});

// Todo: create a function to change the background color of the task container based on the due date
function changeTaskContainerColor(task) {
  const dueDate = new Date(task.dueDate);
  const currentDate = new Date();

  if (dueDate < currentDate) {
      // Due date has passed, set background color to red
      $(`#${task.id}`).css("background-color", "red");
  } else if (dueDate.getTime() - currentDate.getTime() <= 7 * 24 * 60 * 60 * 1000) {
      // Due date is within 7 days, set background color to yellow
      $(`#${task.id}`).css("background-color", "yellow");
  }
}


