
const API_URL = "https://jsonplaceholder.typicode.com/users";

const studentList = document.getElementById("student-list");
const studentForm = document.getElementById("student-form");
const studentName = document.getElementById("student-name");
const studentEmail = document.getElementById("student-email");
const refreshBtn = document.getElementById("refresh-btn");
const statusMessage = document.getElementById("status");

// GET: Retrieve students from the API
async function getStudents() {
  statusMessage.textContent = "Loading students...";
  studentList.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to retrieve students.");
    }

    const students = await response.json();

    students.forEach((student) => {
      displayStudent(student);
    });

    statusMessage.textContent =
      `Successfully loaded ${students.length} students.`;
  } catch (error) {
    statusMessage.textContent = error.message;
  }
}

// Display one student on the page
function displayStudent(student) {
  const card = document.createElement("div");
  card.className = "student-card";

  const info = document.createElement("div");
  info.className = "student-info";

  const name = document.createElement("h3");
  name.textContent = student.name;

  const email = document.createElement("p");
  email.textContent = student.email;

  const id = document.createElement("p");
  id.textContent = `Student ID: ${student.id}`;

  info.append(name, email, id);

  const actions = document.createElement("div");
  actions.className = "student-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit (PUT)";
  editBtn.addEventListener("click", () => updateStudent(student));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteStudent(student.id));

  actions.append(editBtn, deleteBtn);
  card.append(info, actions);
  studentList.appendChild(card);
}

// POST: Create a new student
studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newStudent = {
    name: studentName.value.trim(),
    email: studentEmail.value.trim(),
  };

  if (!newStudent.name || !newStudent.email) {
    statusMessage.textContent = "Please enter a name and email.";
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    });

    if (!response.ok) {
      throw new Error("Failed to add student.");
    }

    const createdStudent = await response.json();

    displayStudent(createdStudent);
    statusMessage.textContent =
      `Student "${createdStudent.name}" added successfully.`;

    studentForm.reset();
  } catch (error) {
    statusMessage.textContent = error.message;
  }
});

// PUT: Update an existing student
async function updateStudent(student) {
  const newName = prompt("Enter the updated student name:", student.name);

  if (newName === null || !newName.trim()) {
    return;
  }

  const newEmail = prompt("Enter the updated student email:", student.email);

  if (newEmail === null || !newEmail.trim()) {
    return;
  }

  const updatedStudent = {
    ...student,
    name: newName.trim(),
    email: newEmail.trim(),
  };

  try {
    const response = await fetch(`${API_URL}/${student.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStudent),
    });

    if (!response.ok) {
      throw new Error("Failed to update student.");
    }

    const result = await response.json();

    // Update the displayed record
    const cards = studentList.querySelectorAll(".student-card");
    cards.forEach((card) => {
      const idText = card.querySelector(".student-info p:last-child");

      if (idText.textContent === `Student ID: ${student.id}`) {
        card.querySelector("h3").textContent = result.name;
        card.querySelector(".student-info p").textContent = result.email;
      }
    });

    statusMessage.textContent =
      `Student "${result.name}" updated successfully.`;
  } catch (error) {
    statusMessage.textContent = error.message;
  }
}

// DELETE: Remove a student
async function deleteStudent(id) {
  const confirmed = confirm("Are you sure you want to delete this student?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete student.");
    }

    // Remove the student card from the page
    const cards = studentList.querySelectorAll(".student-card");

    cards.forEach((card) => {
      const idText = card.querySelector(".student-info p:last-child");

      if (idText.textContent === `Student ID: ${id}`) {
        card.remove();
      }
    });

    statusMessage.textContent = `Student ${id} deleted successfully.`;
  } catch (error) {
    statusMessage.textContent = error.message;
  }
}

// Reload the list using GET
refreshBtn.addEventListener("click", getStudents);

// Load students when the page opens
getStudents();
