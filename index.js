// Fetching DOM elements
const inputEl = document.getElementById("input-el");   // Input element
const inputBtn = document.getElementById("input-btn"); // Add button
const ulEl = document.getElementById("ul-el");         // <ul> element to display links
const deleteBtn = document.getElementById("delete-btn"); // Delete all button
const tabBtn = document.getElementById("tabs-btn");   // Tab button to get current tab URL

let linkArr = []; // Array to store links

// Adding event listeners for UI interactions
tabBtn.addEventListener("click", getCurrentTab);  // Clicking tabBtn fetches current tab URL
deleteBtn.addEventListener('dblclick', deleteAllLinks); // Double click on deleteBtn clears all links
inputBtn.addEventListener('click', addLink); // Clicking inputBtn adds a new link
inputEl.addEventListener('keydown', (e) => { // Listening for Enter key in input field to add link
  if (e.key === 'Enter') {
    addLink();
  }
});

// Fetch links from local storage on page load
document.addEventListener('DOMContentLoaded', fetchLinks);

// Function to get current tab URL using Chrome extension API
function getCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const newLink = tabs[0].url; // Extract URL from tab object
    saveLink(newLink); // Save the new link to local storage
  });
}

// Function to delete all links from local storage and array
function deleteAllLinks() {
  localStorage.clear(); // Clear local storage
  linkArr = []; // Reset linkArr
  render(linkArr); // Render an empty list
}

// Function to fetch links from local storage on page load
function fetchLinks() {
  const leadsFromLocalStorage = JSON.parse(localStorage.getItem("linkArr")); // Retrieve links from local storage
  if (leadsFromLocalStorage) {
    linkArr = leadsFromLocalStorage; // Populate linkArr with retrieved links
    render(linkArr); // Render the fetched links
  }
}

// Function to render links in the UI
function render(leads) {
  let listItem = "";
  for (let lead of leads) {
    listItem += `
      <div class='list-con-btn bg-dark/60 backdrop-blur-3xl p-2 px-4 mt-2 rounded-[5px] relative'>
        <ul>
          <li>
            <a target='_blank' href='${lead}' class='links-name text-light hover:text-mid'>
              ${lead}
            </a>
          </li> 
        </ul>
        <button 
          class='delete-btn ml-auto absolute right-0 top-0 bottom-0 px-3 bg-darkest/45'
        >
          <img src='./delete-icon.png' class='h-6 w-6' />
        </button>
      </div>
    `;
  }
  ulEl.innerHTML = listItem; // Insert generated HTML into the ulEl element

  // Attach event listeners to delete buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      deleteLink(index); // Call deleteLink function on button click
    });
  });
}

// Function to add a new link
function addLink() {
  const newLink = inputEl.value.trim(); // Trim whitespace from input
  if (newLink) {
    linkArr.unshift(newLink); // Add new link to the beginning of linkArr
    inputEl.value = ''; // Clear input field
    saveLinksToLocalStorage(); // Save updated linkArr to local storage
  }
}

// Function to delete a link by index
function deleteLink(index) {
  linkArr.splice(index, 1); // Remove link from linkArr
  saveLinksToLocalStorage(); // Save updated linkArr to local storage
}

// Function to save linkArr to local storage
function saveLinksToLocalStorage() {
  localStorage.setItem("linkArr", JSON.stringify(linkArr)); // Convert linkArr to JSON and store in local storage
  render(linkArr); // Re-render the list with updated links
}
