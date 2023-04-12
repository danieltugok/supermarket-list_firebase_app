const inputFieldEl = document.querySelector('#input-field');
const addButtonEl = document.querySelector('#add-button');

addButtonEl.addEventListener('click', () => {
  const inputValue = inputFieldEl.value;
  console.log(inputValue);
});