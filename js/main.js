let API = "http://localhost:8000/todos";
let inp = document.querySelector(".task-input");
let btn = document.querySelector(".btn");
let ul = document.querySelector(".task-list");

//! Create
btn.addEventListener("click", (e) => {
  if (!inp.value.trim()) {
    alert("Введите данные");
    return;
  }
  let newTodo = {
    todo: inp.value,
  };
  createTodo(newTodo);
  readTask();
  inp.value = "";
});

function createTodo(todo) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(todo),
  }).then(() => readTask());
}

//! Read

function readTask() {
  fetch(API)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      ul.innerHTML = "";
      data.forEach((elem) => {
        ul.innerHTML += `<li>${elem.todo}<button id="${elem.id}" class="btnDelete">Delete</button>
        <button id="${elem.id}" class="btnEdit">Edit</button> </li>`;
      });
    });
}
readTask();

//! Delete
document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  let id = e.target.id;
  if (del_class.includes("btnDelete")) {
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    }).then(() => readTask());
  }
});

//! Edit

let inpEdit = document.querySelector(".inpEdit");
let btnEditSave = document.querySelector(".btnEditSave");
let editModal = document.querySelector(".editModal");

document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  let id = e.target.id;
  if (edit_class.includes("btnEdit")) {
    editModal.style.display = "block";

    fetch(`${API}/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        inpEdit.value = data.todo;
        btnEditSave.setAttribute("id", data.id);
      });
  }
});

btnEditSave.addEventListener("click", (e) => {
  if (!inpEdit.value.trim()) {
    alert("Введите данные");
  }
  let editTodo = {
    todo: inpEdit.value,
  };
  editedTodo(editTodo, btnEditSave.id);
  editModal.style.display = "none";
});

function editedTodo(newTodo, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(newTodo),
  }).then(() => readTask());
}
