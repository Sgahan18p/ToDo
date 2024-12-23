// Fetch All Todos
function fetchTodo() {
    fetch("http://localhost:3000/todo", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("All Todos:", data);
        renderTodo(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Render Todos
  function renderTodo(todos) {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    if (!todos.length) {
      todoList.innerHTML = "<p>No Todos available.</p>";
      return;
    }
    todos.forEach((todo) => {
      const todoItem = document.createElement("div");
      todoItem.className = "todo-item";
      todoItem.innerHTML = `
        <p class="todo-title">Title: ${todo.title}</p>
        <p>Description: ${todo.description}</p>
        <button onclick="deleteTodo(${todo.id})">delete</button>
        <button onclick="openUpdateModal(${todo.id}, '${todo.title}', '${todo.description}')">update</button>
      `;
      todoList.appendChild(todoItem);
    });
  }

  // Delete Todo by ID
  function deleteTodo(id) {
    fetch(`http://localhost:3000/todo/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete ToDo");
        }
        alert("ToDo deleted successfully!");
        fetchTodo(); // Refresh the todo list after deletion
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to delete ToDo!");
      });
  }

  // Open Modal for Updating Todo
  function openUpdateModal(id, currentTitle, currentDescription) {
    // Pre-fill the input fields with current values
    document.getElementById("update-title").value = currentTitle;
    document.getElementById("update-description").value = currentDescription;
    
    // Store the current ID temporarily in a data attribute for easy access
    const modal = document.getElementById("updateModal");
    modal.dataset.todoId = id;

    // Display the modal
    modal.style.display = "block";
  }

  // Close the Modal
  function closeModal() {
    document.getElementById("updateModal").style.display = "none";
  }

  // Handle Update Action
  function updateTodoAction() {
    const title = document.getElementById("update-title").value.trim();
    const description = document.getElementById("update-description").value.trim();
    
    // Get the ToDo ID from the modal's data attribute
    const modal = document.getElementById("updateModal");
    const todoId = modal.dataset.todoId;

    if (!title || !description) {
      alert("Title and Description are required!");
      return;
    }

    fetch(`http://localhost:3000/todo/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update ToDo");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Todo Updated:", data);
        alert("Todo Updated Successfully!");
        fetchTodo(); // Refresh the list
        closeModal(); // Close the modal
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update ToDo!");
      });
  }

  // Handle Save or Add New Todo
  function onPress() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !description) {
      alert("Title and Description are required!");
      return;
    }

    fetch("http://localhost:3000/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save ToDo");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Todo Saved:", data);
        alert("Todo Saved Successfully!");
        fetchTodo(); // Refresh the list
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to save ToDo!");
      });
  }