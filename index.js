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

    push(shoppingListDB, {name: inputValue, read: false, category: selectedCategory });  
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
    let sortedItemsArray = itemsArray.sort((a, b) => {
        if (a[1].category === b[1].category){
            return a[1].name < b[1].name ? -1 : 1
          } else {
            return a[1].category < b[1].category ? -1 : 1
          }
    });

    let existingCategories = [...new Set(sortedItemsArray.map((item) => item[1].category))];

    clearshoppingListEl();  

    for (let i = 0; i < existingCategories.length; i++) {
        const category = existingCategories[i];       
        console.log("🚀 ~ file: index.js:60 ~ onValue ~ element:", category)     
        
        let newEl = document.createElement('div');
        newEl.className = "title";
        newEl.textContent = category || "No category";
        shoppingListEl.appendChild(newEl);

        itemsArray.filter((item) => item[1].category === category).forEach((item) => {
            appendItemToShoppingListEl(item); 
        });       
    }  

    // for (let i = 0; i < itemsArray.length; i++) {
    //     let currentItem = itemsArray[i];
    //     appendItemToShoppingListEl(currentItem);    
    // }    
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

// CATEGORIES
const categoriesNames = [
    'Dairy',
    'Higiene',
    'Cleaning',
    'Disposables',
    'Breakfast',
    'Snacks',
    'Meat',
    'Frozen',
    'Desserts',
    'Health',
    'Fitness',
    'Eletronics',
    'Outdoors',
    'Baby',
    'Clothing',
    'Toys',
    'Office/School',
    'Organization',
    'Furniture',
    'Decor',
    'Pet',
    'Home Improvement',
    'Seasonal',
    'Gardening',
    'Others'
]

const categoryList = document.querySelector("#categories-list");
let selectedCategorySpan = document.querySelector("#selected-category");
let selectedCategory = null;

categoriesNames.forEach((category) => {
    const newCategory = document.createElement("li");
    newCategory.textContent = category;
    categoryList.appendChild(newCategory);

    newCategory.addEventListener('click', (e) => {
        let selectedItem = [...categoryList.querySelectorAll("li.selected")]
        if (selectedItem.length > 0) selectedItem[0].classList.remove("selected");
        e.target.classList.add("selected");
        selectedCategory = e.target.textContent;
        selectedCategorySpan.textContent = e.target.textContent;
        hideModalWindow();
    });
});


// MODAL

// Show Modal
const addCategoryModal = document.querySelector("#add-category");
const modalWindowOverlay = document.getElementById("modal-overlay");

const showModalWindow = () => {
    modalWindowOverlay.style.display = 'flex';
    
    const modal = document.getElementById("modal");
    let height = modal.offsetHeight;
    modalWindowOverlay.style.height = height;
}
addCategoryModal.addEventListener("click", showModalWindow);

const hideModalWindow = () => {
    modalWindowOverlay.style.display = 'none';
}

const closeModalButton = document.getElementById("close-modal");
closeModalButton.addEventListener("click", hideModalWindow);

// Hide On Blur
const hideModalWindowOnBlur = (e) => {
    if(e.target === e.currentTarget) {
        hideModalWindow();
    }
}

modalWindowOverlay.addEventListener("click", hideModalWindowOnBlur)
