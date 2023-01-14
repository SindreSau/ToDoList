const inputText = document.getElementById('inputText');
const inputSubmit = document.getElementById('inputSubmit');
const returnList = document.getElementById('returnList');
let deleteButtons = [];
let inStorageValues = [];
let inStorageKeys = [];
let counter = inStorageValues.length;

//input handling:
inputSubmit.onclick = () => {
  try {
    textContent = inputText.value;
    createNewListItem(textContent);
    /* localStorage.setItem('counter', counter); */
    localStorage.setItem(counter, textContent);
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
  counter++;
  inputText.value = "";

  //Create new items:
  let listItem = new ListItem(textContent);
  let listWrapper = document.createElement('li')
  listWrapper.classList = `list-wrapper ${counter}`;
  listWrapper.innerHTML = listItem.getTextContent();
  returnList.appendChild(listWrapper);

  //Delete items:
  deleteButtons = document.getElementsByClassName('list-delete')
  for (let button of deleteButtons) {
    button.addEventListener('click', (e) => {
      let buttonNumber = button.id;
      console.log(buttonNumber);
      let toRemove = e.target.closest(".list-wrapper")
      toRemove.remove()
      localStorage.removeItem(buttonNumber)
    })
  }
}

class ListItem {
  textContent;
  constructor(textContent) {
    this.textContent = textContent;
  }

  getTextContent() {
    return `
      <div class="list-item">
        <input type="checkbox">
        <p>${this.textContent}</p>
        <img id="${counter}" class="list-delete" src="assets/delete.png" alt="delete">
      </div>
    `;
  }
}


//get items into inStorage on load:
window.onload = () => {
  let key;
  for (let i = 0; i < localStorage.length; i++) {
    console.log(localStorage[i]);
  }
  if (localStorage.length <= 15) {
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i) !== "debug") {
        key = inStorageKeys.push(localStorage.key(i));
      }
      console.log(inStorageKeys);
    }
  } else {
    localStorage.clear();
    console.log("Exceeded storage-limit");
    alert("Exceeded storage-limit. Storage will be cleared")
  }
  for (let i = 0; i < inStorageKeys.length; i++) {
    key = inStorageKeys[i]
    inStorageValues.push(localStorage.getItem(key));
    createNewListItem(inStorageValues[i])
  }
  console.log(inStorageValues);
}

console.log(counter);