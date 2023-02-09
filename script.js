const openModal = () => {
  document.getElementById('modal').classList.add('active')
}

const closeModal = () => {
  clearFields()
  document.getElementById('modal').classList.remove('active')
}

document.getElementById('cadastrarCliente').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('cancelar').addEventListener('click', closeModal)

const getLocalStorage = () => JSON.parse(localStorage.getItem('database')) ?? []
const setLocalStorage = (database) => localStorage.setItem('database', JSON.stringify(database))

//create
const createClient = (client) => {
  const database = getLocalStorage()
  database.push(client)
  setLocalStorage(database)
}

//read
const readClient = () => getLocalStorage()

//update
const updateClient = (client, index) => {
  const database = readClient()
  database[index] = client
  setLocalStorage(database)
}

//delete
const deleteClient = (index) => {
  const database = readClient()
  database.splice(index, 1)
  setLocalStorage(database)
}

const validation = () => {
  return document.querySelector('.modal-form').reportValidity()
}

const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(item => item.value = '')
}

const saveClient = () => {
  if (validation()) {
    const client = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      contato: document.getElementById('contato').value,
      cidade: document.getElementById('cidade').value
    }
    const index = document.getElementById('nome').dataset.index
    if(index == 'new') {
      createClient(client)
      closeModal()
      updateScreen()
    } else {
      updateClient(client, index)
      updateScreen()
      closeModal()
    }
  }
}

document.getElementById('salvar').addEventListener('click', saveClient)

const createRow = (client, index) => { 
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
  <td>${client.nome}</td>
  <td>${client.email}</td>
  <td>${client.contato}</td>
  <td>${client.cidade}</td>
  <td>
      <button type="button" class="button green" data-action="edit-${index}" >Editar</button>
      <button type="button" class="button red" data-action="delete-${index}" >Deletar</button>
  </td>
  `

  document.querySelector('#tbClient>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tbClient>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

const updateScreen = () => {
  const database = readClient()
  clearTable()
  database.forEach(createRow)
}

updateScreen()

const fillFields = (client) => {
  document.getElementById('nome').value = client.nome
  document.getElementById('email').value = client.email
  document.getElementById('contato').value = client.contato
  document.getElementById('cidade').value = client.cidade
  document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
  const client = readClient()[index]
  client.index = index
  fillFields(client)
  openModal()
}

const editDelete = (e) => {
  if (e.target.type == 'button') {
    const [action, index] = e.target.dataset.action.split('-')
    
    if (action == 'edit') {
      editClient(index)
    } else {
      const client = readClient()[index]
      const alert = confirm(`Realmente deseja excluir ${client.nome}?`)
      if (alert) {
        deleteClient(index)
        updateScreen()
      }
    }
  }
}

document.querySelector('#tbClient>tbody').addEventListener('click', editDelete)
