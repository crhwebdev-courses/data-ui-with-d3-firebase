//setup modal window
const modal = document.querySelector(".modal");
M.Modal.init(modal);

// get form elements from DOM
const form = document.querySelector("form");
const name = document.querySelector("#name");
const parent = document.querySelector("#parent");
const department = document.querySelector("#department");

form.addEventListener("submit", e => {
  e.preventDefault();
  console.log(name.value, parent.value, department.value);
  // db.collection("employees").add({
  //   name: name.value,
  //   parent: parent.value,
  //   department: department.value
  // });
});
