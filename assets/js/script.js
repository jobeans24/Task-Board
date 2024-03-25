// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
    
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let card = $("<div>").addClass("card").attr("id", task.id);
    let cardHeader = $("<div>").addClass("card-header").text(task.title);
    let cardBody = $("<div>").addClass("card-body").text(task.description);
    let cardFooter = $("<div>").addClass("card-footer").text(task.dueDate);
    card.append(cardHeader, cardBody, cardFooter);
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    taskList.forEach(task => {
        let card = createTaskCard(task);
        card.draggable({
            revert: "invalid",
            helper: "clone"
        });
        $("#" + task.status).append(card);
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let task = {
        id: generateTaskId(),
        title: $("#title").val(),
        description: $("#description").val(),
        dueDate: $("#dueDate").val(),
        status: "toDo"
    };
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
    let card = createTaskCard(task);
    card.draggable({
        revert: "invalid",
        helper: "clone"
    });
    $("#toDo").append(card);
    $("#addTaskModal").modal("hide");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(event.target).closest(".card").attr("id");
    taskList = taskList.filter(task => task.id != taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $("#" + taskId).remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.draggable.attr("id");
    let newStatus = $(event.target).attr("id");
    let task = taskList.find(task => task.id == taskId);
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    $("#" + taskId).appendTo(event.target);
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#addTask").on("click", handleAddTask);
    $(".delete").on("click", handleDeleteTask);
    $(".lane").droppable({
        drop: handleDrop
    });
    $("#dueDate").datepicker();
});