import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push, onValue, remove, update } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://playground-4e469-default-rtdb.firebaseio.com/',
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListDB = ref(database, 'shoppingList');

const inputFieldEl = document.querySelector('#input-field');
// const addButtonEl = document.querySelector('#add-button');
const shoppingListEl = document.querySelector('#shopping-list');


// addButtonEl.addEventListener('click', () => {
//     addItemsToShoppingList();
// });

inputFieldEl.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addItemsToShoppingList();
    }
});

function addItemsToShoppingList() {
    const inputValue = inputFieldEl.value;
    if (!inputValue) return;

    push(shoppingListDB, {name: inputValue, read: false });  
    clearInputFieldEl();
}


// Connect to DB and get data
onValue(shoppingListDB, (snapshot) => {
    if (!snapshot.exists()) {
        shoppingListEl.innerHTML = 'No items in shopping list';
        return;
    }
    console.log("🚀 ~ file: index.js:45 ~ onValue ~ snapshot.val():", snapshot.val())

    let itemsArray = Object.entries(snapshot.val());
    clearshoppingListEl();    
    for (let i = 0; i < itemsArray.length; i++) {
        let currentItem = itemsArray[i];
        appendItemToShoppingListEl(currentItem);    
    }    
})

function clearshoppingListEl() {
    shoppingListEl.innerHTML = '';
}

function clearInputFieldEl() {
  inputFieldEl.value = '';
}

function appendItemToShoppingListEl(item) {
    let [itemID, itemValue] = item;
    let newEl = document.createElement('li');
    newEl.dataset.id = itemID;
    if (itemValue?.read) newEl.className = 'checked';

    newEl.textContent = itemValue?.name;
    shoppingListEl.appendChild(newEl);

    newEl.addEventListener('dblclick', () => {
        let locationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(locationOfItemInDB);
    });
}

shoppingListEl.addEventListener('click', (e) => {
    // console.log(e.target,e.target.dataset.id, e.target.matches('li'), e.target.innerText);
    if (e.target && e.target.matches('li')) {
        let locationOfItemInDB = ref(database, `shoppingList/${e.target.dataset.id}`);

        if (e.target.classList.contains('checked')) update(locationOfItemInDB, {read: false});
        else update(locationOfItemInDB, {read: true});
    }
});



// MODAL

// Show Modal
const addCategoryModal = document.querySelector("#add-category");
const modalWindowOverlay = document.getElementById("modal-overlay");

const showModalWindow = () => {
  modalWindowOverlay.style.display = 'flex';
}
addCategoryModal.addEventListener("click", showModalWindow);

// Hide Modal
const closeModalButton = document.getElementById("close-modal");

const hideModalWindow = () => {
    modalWindowOverlay.style.display = 'none';
}

closeModalButton.addEventListener("click", hideModalWindow);

// Hide On Blur
const hideModalWindowOnBlur = (e) => {
    if(e.target === e.currentTarget) {
        hideModalWindow();
    }
}

modalWindowOverlay.addEventListener("click", hideModalWindowOnBlur)
