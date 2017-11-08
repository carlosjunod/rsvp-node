var addInvitedButton = document.getElementById('addnew')
var delFirstGuest = document.querySelector('#removeGuest')
var form = document.querySelector('#form')
var sendBtn = document.querySelectorAll('.send-email')
var delBtn = document.querySelectorAll('.eliminar')
var editBtn = document.querySelectorAll('.edit-group')

delFirstGuest.addEventListener('click', (e)=>{
  e.preventDefault()
  delFirstGuest.parentNode.remove()
})

addInvitedButton.addEventListener('click', (e) =>{
  e.preventDefault()
  let insert = e.target.parentNode
  console.log('insert.parentNode.firstChild', insert )
  insert.appendChild(createNewGuestElement(), insert.firstChild)
})

// creating new fields
function createNewGuestElement(){
  // new field
  let newLi = document.createElement("li")
  let newInput = document.createElement("input")
  newInput.setAttribute('type', 'text')
  let newDeleteBtn = document.createElement("Button")
  let newTxtDeleteBtn = document.createTextNode("Delete")

  newDeleteBtn.appendChild(newTxtDeleteBtn)
  newLi.appendChild(newInput)
  newLi.appendChild(newDeleteBtn)

  newDeleteBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    newDeleteBtn.parentNode.remove()
  })

  return newLi
}

/// handeling submition

var submitBtn = document.getElementById('btnsubmit')
submitBtn.addEventListener('click', (e)=>{
  e.preventDefault()

  let guestList = document.getElementById('guests').childNodes
  let list = []
  let obj = {}

  guestList.forEach((el,i) =>{   
    if (el.tagName === 'LI') {
      let input = el.querySelector('input')   
      obj.guesName = input.value
      obj.attend = false
      list.push({...obj})
    }
  })

  let data = {
    groupName : document.querySelector('input[name=groupName]').value,
    size : list.length,
    list,
    lang : 'es',
    email : document.querySelector('input[type=email]').value  
  }  

  fetch('/add', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    console.log('response', response)
    window.location.reload()
  }).catch(err => {
    console.log('err', err)
  })
})


// targeting send buttons
sendBtn.forEach(btn=>{
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    let row = e.target.closest('.row')
    let id = row.querySelector('.hidden').value
    sendEmail(id)
  })
})

const sendEmail = (id) => {
  fetch('/send', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id})
  }).then(response => {
    console.log('response', response)
    // window.location.reload()
    console.log('HERE!!!!!!!!!!!')
    displayMsg('Mensaje Enviado', 'success')      
  }).catch(err => {
    console.log('err', err)
  })
}

// deleting 
// targeting delete buttons
delBtn.forEach(btn=>{
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    let row = e.target.closest('.row')
    let id = row.querySelector('.hidden').value

    console.log('row', row)
    console.log('id---->', id)
    delGroup(id)
  })
})

const delGroup = (id) => { 
  fetch('/rsvp', {
    method: 'delete',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id})
  }).then(response => {
    console.log('response', response)
    window.location.reload()    
  }).catch(err => {
    console.error('err', err)
  })
}

const displayMsg = (msg, color) => {
  console.log('MSG!!!')
  $(this).alertMe({
    message: msg,
    type: color
  })   
}

// targeting edit buttons
editBtn.forEach(btn=>{
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    let row = e.target.closest('.row')
    let id = row.querySelector('.hidden').value

    window.location.href = `edit/${id}`
  })
})

