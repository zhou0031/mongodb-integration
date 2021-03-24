const socket = io(`http://localhost:3001`,{
  autoConnect:false
})

fetch("http://localhost:3000/user/api/signin",{
    method:"post"
})
.then(response=>response.json())
.then(result=>{
    fetch("http://localhost:3001/signin",{
      method:"post",
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify(result)
    })
})
.catch(error=>{
  console.error('Error:', error)
})
 

var form = document.getElementById('form')
var input = document.getElementById('input')

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat-message', input.value);
    input.value = ''
  }
})


socket.on('chat-message', function(message) {
  var item = document.createElement('li')
  item.textContent = message
  messages.appendChild(item)
  window.scrollTo(0, document.body.scrollHeight)
})



