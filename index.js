// Import necessary functions from the Firebase module
import { database, ref, set, push, onValue, remove } from './firebase.js';

// Get references to the DOM elements
const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tabs-btn");

// Initialize an empty array to store the links
let linkArr = [];

// Add event listeners to the buttons and input field
tabBtn.addEventListener("click", () => getCurrentTab()); // Save the current tab
deleteBtn.addEventListener('dblclick', () => deleteAllLinks()); // Delete all links on double-click
inputBtn.addEventListener('click', () => addLink()); // Add a new link
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addLink(); // Add a new link on Enter key press
  }
});

// Function to get the current tab URL and save it to Firebase
function getCurrentTab() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const newLinkRef = push(ref(database, 'links')); // Create a new reference in the database
    set(newLinkRef, tabs[0].url); // Save the URL to the database
  });
}

// Function to delete all links from Firebase
function deleteAllLinks(){
  remove(ref(database, 'links')); // Remove all data from the 'links' reference
  linkArr = []; // Clear the local array
  render(linkArr); // Re-render the list
}

// Function to fetch links from Firebase and render them
function fetchLinks() {
  onValue(ref(database, 'links'), (snapshot) => { // Listen for changes in the 'links' reference
    linkArr = []; // Clear the local array
    snapshot.forEach((childSnapshot) => { // Iterate through each child in the snapshot
      linkArr.push({
        id: childSnapshot.key, // Get the unique key of each child
        url: childSnapshot.val() // Get the URL value of each child
      });
    });
    render(linkArr); // Render the list of links
  });
}

// Function to render the list of links
function render(leads) {
  let listItem = "";
  for (let lead of leads) {
    listItem += `
      <div class='list-con-btn bg-dark/60 backdrop-blur-3xl p-2 px-4 mt-2 rounded-[5px] relative'>
        <ul>
          <li>
            <a target='_blank' href='${lead.url}' class='links-name text-light hover:text-mid'>
              ${lead.url}
            </a>
          </li> 
        </ul>
        <button 
          class='delete-btn ml-auto absolute right-0 top-0 bottom-0 px-3 bg-darkest/45' 
          data-id='${lead.id}'
        >
          <img src='./delete-icon.png' class='h-6 w-6' />
        </button>
      </div>
    `;
  }
  ulEl.innerHTML = listItem; // Update the inner HTML of the list container

  // Attach event listeners to the newly created delete buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('data-id'); // Get the data-id attribute of the button
      remove(ref(database, 'links/' + id)); // Remove the corresponding link from Firebase
    });
  });
}

// Function to add a new link
function addLink(){
  const newLink = inputEl.value.trim(); // Get the trimmed value of the input field
  if (newLink) {
    const newLinkRef = push(ref(database, 'links')); // Create a new reference in the database
    set(newLinkRef, newLink); // Save the new link to the database
    inputEl.value = ''; // Clear the input field
  }
}

// Fetch links from Firebase and render them when the document is fully loaded
document.addEventListener('DOMContentLoaded', fetchLinks);
