let inputField = document.getElementById('input-item')
let itemList = document.getElementById('item-list')

// itemTemplate Function
const itemTemplate = ({ _id, text }) => `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${text}</span>
        <div>
            <button data-id='${_id}' class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id='${_id}' class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
    </li>
    `

//
// ─── INITIAL PAGE LOAD RENDER ───────────────────────────────────────────────────
//

let itemHTML = items.map(item => itemTemplate(item)).join('')
itemList.insertAdjacentHTML('beforeend', itemHTML)

// Add item without reload page
document.getElementById('create-form').addEventListener('submit', e => {
    e.preventDefault();

    if (inputField.value) {
        axios.post('/create-item', { text: inputField.value })
            .then((res) => {
                itemList.insertAdjacentHTML('beforeend', itemTemplate(res.data))
                // Clear Field Input
                inputField.value = ''
                inputField.focus()
            })
            .catch(() => {
                console.log('Add items error')
            })
    }
})


//
// ─── DELETE AND UPDATE ──────────────────────────────────────────────────────────
//
document.addEventListener('click', e => {
    let itemText = e.target.parentElement.parentElement.querySelector('.item-text')
    let id = e.target.getAttribute('data-id')

    //
    // ─── DELETE ITEMS ───────────────────────────────────────────────────────────────
    //
    if (e.target.classList.contains('delete-me')) {

        if (confirm('Are you sure to delete?')) {
            axios.post('/delete-item', { id: id })
                .then(() => {
                    e.target.parentElement.parentElement.remove()
                })
                .catch(() => {
                    console.log('Delete Error')
                })
        }
    }


    //
    // ─── UPDATE ITEMS ───────────────────────────────────────────────────────────────
    //
    if (e.target.classList.contains('edit-me')) {

        let userInput = prompt('Enter your desired new text', itemText.innerHTML)
        if (userInput) {
            axios.post('/update-item', { text: userInput, id: id })
                .then(() => {
                    // Run when axios is completed
                    itemText.innerHTML = userInput;
                })
                .catch(() => {
                    console.log('Update Error')
                })
        }
    }
})