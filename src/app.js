const inputText = document.getElementById('inputText');
const inputSubmit = document.getElementById('inputSubmit');
const returnList = document.getElementById('returnList');
const completedList = document.getElementById('completedList');
let listItems = [];
let completedItems = [];
let deleteButtons = [];

//input handling:
inputSubmit.onclick = () => {
  try {
    textContent = inputText.value;
    inputText.value = "";
    if (textContent != "") {
      createNewListItem(textContent);
    }
  } catch (error) {
    console.log(error);
  }
};

inputText.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    inputSubmit.click();
    document.change
  }
})

//Sortable:
const sortable = new Sortable(returnList, {
  handle: '.handle',
  animation: 200,
  ghostclass: 'sortable-ghost-class',
  onEnd: (event) => {
    saveState()
  }
});

const sortableCompleted = new Sortable(completedList, {
  handle: '.handle',
  animation: 200,
  ghostclass: 'sortable-ghost-class',
  onEnd: (event) => {
    saveCompleted()
  }
});

function createNewListItem(textContent) {
  renderItems(textContent)
  saveState();
}

class ListItem {
  textContent;
  constructor(textContent) {
    this.textContent = textContent;
  }

  getTextContent() {
    return `
      <div class="list-item">
        <div class="handle"><img src="assets/drag.png"></div>
        <input type="checkbox">
        <p>${this.textContent}</p>
        <img id="deleteBtn" class="list-delete" src="assets/delete.png" alt="delete">
      </div>
    `;
  }
}

function renderItems(textContent) {
  //Render new items:
  let lI = new ListItem(textContent)
  let listWrapper = document.createElement('li')
  listWrapper.classList = `list-wrapper`;
  listWrapper.innerHTML = lI.getTextContent();
  addCheckEventlistener(listWrapper);
  addDeleteEventlistener(listWrapper)
  listItems.push(listWrapper);
  returnList.appendChild(listWrapper);
}

function renderCompletedItems(textContent, id) {
  let lI = new ListItem(textContent)
  let listWrapper = document.createElement('li')
  listWrapper.classList = `list-wrapper`;
  listWrapper.innerHTML = lI.getTextContent();
  listItems.push(listWrapper);
  completedList.appendChild(listWrapper);
  listWrapper.querySelector('div').classList.add("is-checked")
}


//handle page refresh:
function getListItems() {
  if (localStorage.getItem('returnListState') !== null) {
    const storedReturnlistState = localStorage.getItem('returnListState')
    returnList.innerHTML = storedReturnlistState;
    const storedCompleteListState = localStorage.getItem('completedList')
    completedList.innerHTML = storedCompleteListState;
  }
}
window.onload = () => {
  getListItems();
  listItems = Array.from(returnList.querySelectorAll('li'));
  listItems.forEach(listItem => {
    addCheckEventlistener(listItem);
    addDeleteEventlistener(listItem);
  })
  completedItems = Array.from(completedList.querySelectorAll('li'));
  completedItems.forEach(completedItem => {
    addDeleteEventlistener(completedItem);
  })
}

//handle checkboxes
function addCheckEventlistener(element) {
  let checkbox = element.querySelector('input');
  checkbox.addEventListener('change', () => {
    let textContent = element.querySelector('p').textContent;
    if (checkbox.checked) {
      renderCompletedItems(textContent)
      completedItems.push(element)
      element.remove()
      saveState();
      saveCompleted();
    }
  })
}

//handle deleting
function addDeleteEventlistener(element) {
  let deleteBtn = element.querySelectorAll('img')[1];
  
  deleteBtn.addEventListener('click', () => {
    element.remove();
    saveState();
    saveCompleted();
  })
}

//Savestate function
function saveState() {
  localStorage.setItem('returnListState', returnList.innerHTML)
}

function saveCompleted() {
  localStorage.setItem('completedList', completedList.innerHTML)
}