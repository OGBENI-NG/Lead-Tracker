let myLead = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deletBtn = document.getElementById("delet-btn")
const tabBtn = document.getElementById("tabs-btn")
inputBtn.disabled = true
isClick = false

//adding an event listener to saveTab, inputs and delete all events 
ulEl.addEventListener("click", (e) => removeLeads(e))
tabBtn.addEventListener("click", () => getCurrentTab())
deletBtn.addEventListener('dblclick', () => deleteAllLinks())
inputBtn.addEventListener('click', () => getInputValue())

inputEl.addEventListener('keydown', () => {
    inputBtn.disabled = false
})

function getCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        myLead.push(tabs[0].url)
        localStorage.setItem( "myLead", JSON.stringify(myLead) )
        render(myLead)
    })
}

function deleteAllLinks(){
    localStorage.clear()
    myLead = []
    render(myLead)
}

const leadfromLocalstorage = JSON.parse( localStorage.getItem("myLead") )
if(leadfromLocalstorage) {
    myLead = leadfromLocalstorage
    render(myLead)
}

function render(leads) {
    let listItem = ""
    for(let lead of leads) {
        listItem += `
            <div class="list-con-btn">
                <ul>
                    <li>
                        <a target='-blank' href='${lead}' class="links-name">
                            ${lead}
                        </a>
                    </li> 
                </ul>
                <div class="delete-con-btn">
                    <button class="delete-btn">X</button>
                </div>
            </div>
        `
       // const li = document.createElement("li")
        //li.textContent = myLead[i]
        //ulEl.appendChild(li)
    }
    ulEl.innerHTML = listItem
  }

  function getInputValue(){
    myLead.push(inputEl.value)
    inputEl.value = ''
    inputBtn.disabled = true
    localStorage.setItem("myLead", JSON.stringify(myLead))
    render(myLead)
  }


// delete each save links from the list
function removeLeads(e) {
    if  (e.target.classList.contains('delete-btn') || e.target.parentElement.classList.contains('delete-con-btn')) {
        const containerToDelete = e.target.closest('.list-con-btn')
        const linkToDelete = containerToDelete.querySelector('.links-name').textContent.trim() 
        let localStorageLinks = JSON.parse(localStorage.getItem('myLead'))
        localStorageLinks = localStorageLinks.filter(link => link !== linkToDelete) 
        localStorage.setItem('myLead', JSON.stringify(localStorageLinks))
        myLead = localStorageLinks
        render(myLead)
    }
}




