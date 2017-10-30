var addInvitedButton = document.getElementById('addnew')
var delFirstGuest = document.querySelector('#removeGuest')
var form = document.querySelector('#form')

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