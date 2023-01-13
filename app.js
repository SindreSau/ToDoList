const inputText = document.getElementById('inputText');
const inputSubmit = document.getElementById('inputSubmit');
const returnList = document.getElementById('returnList');
let deleteButtons;
let textContent;
let counter = 1;

//input handling:
inputSubmit.onclick = () => {
  textContent = inputText.value;
  createNewListItem(textContent);
};

inputText.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    inputSubmit.click();
  }
})


//Create items:
function createNewListItem(textContent) {
  inputText.value = "";
  let listItem = new ListItem(textContent);
  let listWrapper = document.createElement('div')
  listWrapper.classList = `list-wrapper ${counter}`;
  listWrapper.innerHTML = listItem.getTextContent();
  returnList.appendChild(listWrapper);

  //Save items:
  counter = localStorage.getItem('counter') || 1;
  window.localStorage.setItem(counter++, `${textContent}`);
  localStorage.setItem('counter', counter);

  //Delete items:
  deleteButtons = document.getElementsByClassName('list-delete')
  for (let button of deleteButtons) {
    button.addEventListener('click', (e) => {
      let buttonNumber = button.id;
      let toRemove = e.target.closest(".list-wrapper")
      toRemove.remove()
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
      <li class="list-item">
        <input type="checkbox">
        <p>${this.textContent}</p>
        <img id="${counter}" class="list-delete" src="assets/delete.png" alt="delete">
      </li>
    `;
  }
}

//Hente lagret data på load:
window.onload = () => {
  /* counter = localStorage.getItem('counter') || 1; */
  try {
    if (localStorage.length < 100 && localStorage.length > 0) {
      for (let i = localStorage.length; i > 0; i++) {
        let key = localStorage.key(i)
        let value = localStorage.getItem(key)
        if (key != "debug" && key != "counter") {
          /* createOnLoad(value); */
          console.log("running createOnLoad");
        }
      }
    } else {
      localStorage.clear();
    }
  } catch (error) {
    console.log(error);
  }
}

function createOnLoad(textContentOnLoad) {
  let listItem = new ListItem(textContentOnLoad);
  let listWrapper = document.createElement('div')
  listWrapper.classList = `list-wrapper ${counter}`;
  listWrapper.innerHTML = listItem.getTextContent();
  returnList.appendChild(listWrapper);
}