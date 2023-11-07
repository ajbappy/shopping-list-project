const itemForm = document.querySelector("#item-form");

const itemInput = document.querySelector("#item-input");

const itemList = document.querySelector("#item-list");

const clearBtn = document.querySelector("#clear");
const filter = document.querySelector("#filter");

const addBtn = itemForm.querySelector("#add-btn");

let isEditMode = false;

const displayItem = () => {
  const getDataFromStorage = getItemFromLocalStorage();

  getDataFromStorage.forEach((item) => addItemToDom(item));
  clearState();
};

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  if (newItem === "") {
    alert("please add item");
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIsItemExist(newItem)) {
      alert("that item already exist");
      return;
    }
   
  }

  // function call for add item to dom

  addItemToDom(newItem);
  setItemToLocalStorage(newItem);

  clearState();

  itemInput.value = "";
}

// add item to dom

const addItemToDom = (item) => {
  const list = document.createElement("li");
  list.appendChild(document.createTextNode(item));
  const btn = removeBtn("remove-item btn-link text-red");
  list.appendChild(btn);

  itemList.appendChild(list);
};

function removeBtn(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = addIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function addIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

// remove item

function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIsItemExist(item) {
  const itemsFromStorage = getItemFromLocalStorage();
  return itemsFromStorage.includes(item);
}

// edit mode

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  item.classList.add("edit-mode");

  addBtn.innerHTML = '<i class="fa-solid fa-pen"></i> update';
  addBtn.style.backgroundColor = "#228B22";

  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm("Are you sure")) {
    // remove item from dom
    item.remove();
    // remove item from localStorage
    removeItemFromStorage(item.textContent);
    clearState();
  }
}

function removeItemFromStorage(item) {
  let getDataFromLocalStorage = getItemFromLocalStorage();

  getDataFromLocalStorage = getDataFromLocalStorage.filter((i) => i !== item);

  localStorage.setItem("items", JSON.stringify(getDataFromLocalStorage));
}

function clearItem() {
  // itemList.innerHTML = "";

  while (itemList.firstChild) {
    itemList.firstChild.remove();
  }

  localStorage.removeItem("items");

  clearState();
}

// filter item

function itemFilter(e) {
  const itemFilter = e.target.value.toLowerCase();
  const lists = document.querySelectorAll("li");

  lists.forEach((item) => {
    const list = item.firstChild.textContent.toLowerCase();

    if (list.indexOf(itemFilter) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

// set data to local Storage

const setItemToLocalStorage = (item) => {
  const getDataFromStorage = getItemFromLocalStorage();

  getDataFromStorage.push(item);

  localStorage.setItem("items", JSON.stringify(getDataFromStorage));
};
// get data from localStorage
const getItemFromLocalStorage = () => {
  let getDataFromStorage;
  if (localStorage.getItem("items") === null) {
    getDataFromStorage = [];
  } else {
    getDataFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return getDataFromStorage;
};
// claer state
function clearState() {
  itemInput.value = "";
  const lists = document.querySelectorAll("li");
  if (lists.length === 0) {
    clearBtn.style.display = "none";
    filter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    filter.style.display = "block";
  }

  addBtn.innerHTML = ' <i class="fa-solid fa-plus"></i> Add Item';
  addBtn.style.backgroundColor = "#333";

  isEditMode = false;
}

// initialize app

function init() {
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearItem);
  filter.addEventListener("input", itemFilter);
  document.addEventListener("DOMContentLoaded", displayItem);

  clearState();
}

init();
