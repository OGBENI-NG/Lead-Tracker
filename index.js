// Get references to the necessary DOM elements
const inputEl = document.getElementById("input-el"); // Input field element
const inputBtn = document.getElementById("input-btn"); // Button to add link
const ulEl = document.getElementById("ul-el"); // Unordered list element where links will be displayed
const deleteBtn = document.getElementById("delete-btn"); // Button to delete all links
const tabBtn = document.getElementById("tabs-btn"); // Button to save the current tab

let linkArr = []; // Array to store the links

// Adding event listeners to the respective buttons and input field
tabBtn.addEventListener("click", getCurrentTab); // Save the current tab's URL on button click
deleteBtn.addEventListener('dblclick', deleteAllLinks); // Delete all links on double-click
inputBtn.addEventListener('click', addLink); // Add the link from input field on button click
inputEl.addEventListener('keydown', (e) => { // Add link when Enter key is pressed
  if (e.key === 'Enter') {
    addLink();
  }
});

// Function to get the current tab's URL and save it to the array and local storage
function getCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { // Query the currently active tab
    linkArr.push(tabs[0].url); // Add the tab's URL to the array
    localStorage.setItem("linkArr", JSON.stringify(linkArr)); // Save the array to local storage
    render(linkArr); // Update the displayed list
  });
}

// Function to delete all links
function deleteAllLinks() {
  localStorage.clear(); // Clear local storage
  linkArr = []; // Empty the array
  render(linkArr); // Update the displayed list
}

// Load links from local storage when the page loads
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("linkArr"));
if (leadsFromLocalStorage) { // Check if there are any saved links
  linkArr = leadsFromLocalStorage; // Load the saved links into the array
  render(linkArr); // Update the displayed list
}

// Function to render the list of links
function render(leads) {
  let listItem = ""; // Initialize an empty string to build the list items
  for (let lead of leads) { // Loop through the array of links
    listItem += `
      <div class='list-con-btn bg-dark/60 backdrop-blur-3xl p-2 px-4 mt-2 
      rounded-[5px] relative  w-[365px] m-auto '>
        <ul>
          <li>
            <a target='_blank' href='${lead}' class='links-name text-light hover:text-mid'>
              ${lead}
            </a>
          </li> 
        </ul>
        <button class='delete-btn ml-auto absolute right-0 top-0 bottom-0 px-3 bg-darkest/45'>
          <img src='./delete-icon.png' class='h-6 w-6' />
        </button>
      </div>
    `;
  }
  ulEl.innerHTML = listItem; // Update the HTML content of the list element

  // Attach event listeners to newly created delete buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => { // Loop through each delete button
    button.addEventListener('click', function() { // Add click event listener to each button
      const parentDiv = this.closest('.list-con-btn'); // Get the parent div of the clicked button
      const linkToDelete = parentDiv.querySelector('.links-name').textContent.trim(); // Get the link URL to delete
      linkArr = linkArr.filter(link => link !== linkToDelete); // Remove the link from the array
      localStorage.setItem('linkArr', JSON.stringify(linkArr)); // Update local storage
      render(linkArr); // Re-render the list
    });
  });
}

// Function to add a link from the input field to the array and local storage
function addLink() {
  linkArr.unshift(inputEl.value); // Add the new link to the beginning of the array
  inputEl.value = ''; // Clear the input field
  localStorage.setItem("linkArr", JSON.stringify(linkArr)); // Save the updated array to local storage
  render(linkArr); // Update the displayed list
}
