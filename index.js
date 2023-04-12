import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
    databaseURL: 'https://playground-4e469-default-rtdb.firebaseio.com/',
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListDB = ref(database, 'shoppingList');

const inputFieldEl = document.querySelector('#input-field');
const addButtonEl = document.querySelector('#add-button');
const shoppingListEl = document.querySelector('#shopping-list');


addButtonEl.addEventListener('click', () => {
  const inputValue = inputFieldEl.value;
  push(shoppingListDB, inputValue);  
  clearInputFieldEl();
});


// Connect to DB and get data
onValue(shoppingListDB, (snapshot) => {
    let itemsArray = Object.values(snapshot.val());
    clearshoppingListEl();
    
    for (let i = 0; i < itemsArray.length; i++) {
        appendItemToShoppingListEl(itemsArray[i]);    
    }      
})

function clearshoppingListEl() {
    shoppingListEl.innerHTML = '';
}

function clearInputFieldEl() {
  inputFieldEl.value = '';
}

function appendItemToShoppingListEl(inputValue) {
    shoppingListEl.innerHTML += `<li>${inputValue}</li>`;
}