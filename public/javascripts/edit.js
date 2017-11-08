
/// del buttons
let allDelBtn = document.getElementsByClassName('js-removeThisGuest')
var addInvitedButton = document.getElementById('addnew')



console.log('allDelBtn', allDelBtn)
Array.prototype.forEach.call(allDelBtn, btn => {
  btn.addEventListener('click', (e)=> {
    e.preventDefault()
    btn.parentNode.remove()
  })  

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
  let newCheckBox = document.createElement("input")
  newCheckBox.setAttribute('type', 'checkbox')
  newCheckBox.name="assist"
  

  newDeleteBtn.appendChild(newTxtDeleteBtn)
  newLi.appendChild(newInput)
  newLi.appendChild(newCheckBox)
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
  let id = document.querySelector('.hidden').value
  let list = []
  let obj = {}

  // console.log('guestList', guestList)

  guestList.forEach((el,i) =>{ 
    // console.log('el', el)  
    if (el.tagName === 'LI') {
      let input = el.querySelector('input')
      let checkbox = el.querySelector('[name="assist"]')      
      obj.guesName = input.value
      obj.attend = checkbox.checked
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

  console.log('data', data)

  fetch(`/edit/${id}`, {
    method: 'put',
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
