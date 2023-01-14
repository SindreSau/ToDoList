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
  checkBoxes = document.getElementsByClassName('checkbox');
  for (let checkbox of checkBoxes) {
    checkbox.addEventListener('click', (e) => {
      console.log("clicked checkbox");
      checkBoxHandler(checkbox);
    });
  }

  deleteButtons = document.getElementsByClassName('list-delete')
  for (let button of deleteButtons) {
    button.addEventListener('click', (e) => deleteItems(button))
  }

  renderCompletedEvents(JSON.parse(localStorage.getItem('completedEvents')));
}


function renderItems(textContent, id, isChecked) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("checkbox");
  checkbox.checked = isChecked;

  const listItem = document.createElement("li");
  listItem.classList.add("list-item");
  if (isChecked) {
    console.log(listItem);
    listItem.classList.toggle("is-checked");
  }
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
  const checkboxId = checkbox.closest('.list-item').getElementsByClassName('list-delete')[0].id;
  console.log("id: " + checkboxId);
  for (let i = 0; i < listItems.length; i++) {
    if (listItems[i].id == checkboxId) {
      listItems[i].isChecked = checkbox.checked;
      if (listItems[i].isChecked) {
        console.log("Adding " + listItems[i].textContent);
        completedEvents.push(listItems[i])
        listItems.splice(i, 1);
        console.log("listItems updated: " + listItems);
        localStorage.setItem('completedEvents', JSON.stringify(completedEvents))
        localStorage.removeItem('listItems', listItems)
        localStorage.setItem('listItems', JSON.stringify(listItems))
      } else {
        for (let j = 0; j < completedEvents.length; j++) {
          if (completedEvents[j].id == checkboxId) {
            completedEvents.splice(j, 1);
            localStorage.removeItem('completedEvents', completedEvents);
            localStorage.setItem('completedEvents', JSON.stringify(completedEvents))
          }
        }
      }
    }
  }
  console.log("Completed: " + completedEvents);
}

function renderCompletedEvents(completedEvents) {
  if (completedEvents != null) {
    for (let i = 0; i < completedEvents.length; i++) {
      console.log("Rendering these completed: ");
      console.log(completedEvents[i]);
      let isChecked = true;
      let textContent = completedEvents[i].textContent;
      let id = completedEvents[i].id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("checkbox");
      checkbox.checked = isChecked;

      const listItem = document.createElement("li");
      listItem.classList.add("list-item");
      if (isChecked) {
        listItem.classList.toggle("is-checked");
      }
      listItem.innerHTML = `
        <div class="drag-area"><img src="assets/drag.png" class=""></div>
        <p>${textContent}</p>
        <img id="${id}" class="list-delete" src="assets/delete.png" alt="delete">
      `;

      listItem.insertBefore(checkbox, listItem.firstChild);
      returnList.appendChild(listItem);
    }
  }
}