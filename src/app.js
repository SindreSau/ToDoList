const inputText = document.getElementById('inputText');
const inputSubmit = document.getElementById('inputSubmit');
const returnList = document.getElementById('returnList');
let listItems = [];
let checkBoxes = [];
let completedEvents = [];
let deleteButtons = [];
let dragAreas = [];

//input handling:
inputSubmit.onclick = () => {
  try {
    let isChecked = false
    textContent = inputText.value;
    inputText.value = "";
    createNewListItem(textContent, isChecked);
    localStorage.setItem('listItems', JSON.stringify(listItems));
  } catch (error) {
    console.log(error);
  }
};

inputText.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    inputSubmit.click();
  }
})


function createNewListItem(textContent, isChecked) {
  let listItem = {
    id: Date.now(),
    textContent: textContent,
    isChecked: isChecked
  };

  renderItems(listItem.textContent, listItem.id, listItem.isChecked)

  listItems.push(listItem)

  deleteButtons = document.getElementsByClassName('list-delete')
  for (let button of deleteButtons) {
    button.addEventListener('click', (e) => deleteItems(button))
  }

  checkBoxes = document.getElementsByClassName('checkbox');
  for (let checkbox of checkBoxes) {
    checkbox.addEventListener('click', (e) => checkBoxHandler(checkbox))
  }
}


//handle page refresh:
function getListItems() {
  if (localStorage.getItem('listItems') !== null) {
    listItems = JSON.parse(localStorage.getItem('listItems'));
  }
}

window.onload = () => {
  getListItems();
  for (let i = 0; i < listItems.length; i++) {
    renderItems(listItems[i].textContent, listItems[i].id, listItems[i].isChecked);
  }

  deleteButtons = document.getElementsByClassName('list-delete')
  for (let button of deleteButtons) {
    button.addEventListener('click', (e) => deleteItems(button))
  }

  checkBoxes = document.getElementsByClassName('checkbox');
  for (let checkbox of checkBoxes) {
    checkbox.addEventListener('click', (e) => checkBoxHandler(checkbox))
  }
}

function renderItems(textContent, id, isChecked) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");
  checkbox.checked = isChecked;

  const listItem = document.createElement("li");
  listItem.classList.add("list-item");
  listItem.innerHTML = `
    <div class="drag-area"><img src="assets/drag.png" class=""></div>
    <p>${textContent}</p>
    <img id="${id}" class="list-delete" src="assets/delete.png" alt="delete">
  `;

  listItem.insertBefore(checkbox, listItem.firstChild);
  returnList.appendChild(listItem);
}


//Delete items:
function deleteItems(button) {
  let buttonId = button.id;
  let toRemove = button.closest('.list-wrapper');
  toRemove.remove()
  for (let i = 0; i < listItems.length; i++) {
    if (parseInt(listItems[i].id) === parseInt(buttonId)) {
      localStorage.removeItem('listItems')
      listItems.splice(i, 1);
    }
  }
  localStorage.setItem('listItems', JSON.stringify(listItems));
}


//Sortable:
const sortable = new Sortable(returnList, {
  onEnd: (event) => {
    listItems.splice(event.newIndex, 0, listItems.splice(event.oldIndex, 1)[0])
    localStorage.setItem('listItems', JSON.stringify(listItems))
  }
});

//Handle completed events:
function checkBoxHandler(checkbox) {
  const listItemId = checkbox.parentNode.querySelector('.list-delete').id;
  listItems = listItems.map(item => {
    if (item.id === parseInt(listItemId)) {
      item.isChecked = checkbox.checked;
    }
    return item;
  });
  localStorage.setItem('listItems', JSON.stringify(listItems));
}