//This time focusing on using arrays!

const inputText = document.getElementById('inputText');
const inputSubmit = document.getElementById('inputSubmit');
const returnList = document.getElementById('returnList');
let listItems = [];
let deleteButtons = [];

//input handling:
inputSubmit.onclick = () => {
  try {
    textContent = inputText.value;
    inputText.value = "";
    createNewListItem(textContent);
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


function createNewListItem(textContent) {
  let listItem = {
    id: Date.now(),
    textContent: textContent
  };

  renderItems(listItem.textContent, listItem.id)

  listItems.push(listItem)

  deleteButtons = document.getElementsByClassName('list-delete')
  for (let button of deleteButtons) {
    button.addEventListener('click', (e) => deleteItems(button))
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
    renderItems(listItems[i].textContent, listItems[i].id)
  }

  deleteButtons = document.getElementsByClassName('list-delete')
  for (let button of deleteButtons) {
    button.addEventListener('click', (e) => deleteItems(button))
  }
}

class ListItem {
  textContent;
  id;
  constructor(textContent, id) {
    this.textContent = textContent;
    this.id = id;
  }

  getTextContent() {
    return `
      <div class="list-item">
        <div class="drag-area"><img src="assets/drag.png"></div>
        <input type="checkbox">
        <p>${this.textContent}</p>
        <img id="${this.id}" class="list-delete" src="assets/delete.png" alt="delete">
      </div>
    `;
  }
}

function renderItems(textContent, id) {
  //Create new items:
  let lI = new ListItem(textContent, id)
  let listWrapper = document.createElement('li')
  listWrapper.classList = `list-wrapper`;
  listWrapper.innerHTML = lI.getTextContent();
  returnList.appendChild(listWrapper);

  //Handle drag and drop:
  
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
      console.log(listItems);
    }
  }
  localStorage.setItem('listItems', JSON.stringify(listItems));
}


//Sortable:

/* $(function () {
  $("#returnList").sortable();
}); */