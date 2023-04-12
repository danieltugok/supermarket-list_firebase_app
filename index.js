import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

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
    if (!inputValue) return;
    
    push(shoppingListDB, inputValue);  
    clearInputFieldEl();
});


// Connect to DB and get data
onValue(shoppingListDB, (snapshot) => {
    if (!snapshot.exists()) {
        shoppingListEl.innerHTML = 'No items in shopping list';
        return;
    }

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
    newEl.textContent = itemValue;
    shoppingListEl.appendChild(newEl);

    newEl.addEventListener('dblclick', () => {
        let locationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(locationOfItemInDB);
    });
}