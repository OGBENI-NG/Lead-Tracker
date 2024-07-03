// Get references to the necessary DOM elements
const inputEl = document.getElementById("input-el"); // Input field element
const inputBtn = document.getElementById("input-btn"); // Button to add link
const ulEl = document.getElementById("ul-el"); // Unordered list element where links will be displayed
const deleteBtn = document.getElementById("delete-btn"); // Button to delete all links
const tabBtn = document.getElementById("tabs-btn"); // Button to save the current tab
const totalWebsite = document.getElementById('total') // Element to display the total number of websites saved
const doubleLinkWarning = document.getElementById("warning"); // Element to display duplicate link warning

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
    const newLink = tabs[0].url; // Get the URL of the current tab

    // Check if the link already exists in the array
    if (linkArr.includes(newLink)) {
      displayDuplicateWarning(); // Display duplicate warning message
      return; // Exit the function if the link already exists
    }

    linkArr.unshift(newLink); // Add the new link to the array
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
      rounded-[5px] relative transition-all'>
        <ul>
          <li class='text-light hover:text-mid'>
            <a target='_blank' href='${lead}' 
              class='links-name block overflow-hidden text-ellipsis whitespace-nowrap max-w-[260px]
              hover:max-w-[260px] hover:text-wrap hover:underline hover:overflow-hidden'>
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
  totalWebsite.textContent = `Total links: ${linkArr.length}` // Display the total number of websites saved
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
  const newLink = inputEl.value.trim(); // Get the trimmed value of the input field

  // Check if the input field is empty or if the link already exists in the array
  if (newLink === '' || linkArr.includes(newLink)) {
    displayDuplicateWarning(); // Display duplicate warning message
    return; // Exit the function if the input is empty or the link already exists
  }

  linkArr.unshift(newLink); // Add the new link to the beginning of the array
  inputEl.value = ''; // Clear the input field
  localStorage.setItem("linkArr", JSON.stringify(linkArr)); // Save the updated array to local storage
  render(linkArr); // Update the displayed list
}

// Function to display a duplicate warning message
function displayDuplicateWarning() {
  doubleLinkWarning.textContent = "Link already exists";
  doubleLinkWarning.style.color = "red";
  doubleLinkWarning.style.paddingBottom = "3px";
  doubleLinkWarning.style.fontWeight = "bold";
  setTimeout(() => {
    doubleLinkWarning.textContent = ""; // Clear the warning message after a delay
    inputEl.value = ''
  }, 4000); // Adjust the delay as needed (in milliseconds)
}
