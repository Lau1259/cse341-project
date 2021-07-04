// Initialize socket.io
const socket = io('/');

// Repopulate the list when the server broadcasts an event
socket.on('update-list', () => {
  populateList();
});


const populateList = () => {
  const nameList = document.getElementById('heroList')

  fetch('/prove/11/fetchAll')
    .then(res => res.json())
    .then(data => {
      // Clear the list first
      while (nameList.firstChild) nameList.firstChild.remove()

      // Repopulate the list
      for (const avenger of data.avengers) {
        const li = document.createElement('li');
        const infoBtn = document.createElement('button');
        const removeBtn = document.createElement('button');

        // Create a button to get information about a hero
        infoBtn.setAttribute('onclick', `getInfo('${avenger.id}')`)
        infoBtn.innerText = 'Get Details'

        // Create a button to delete a hero
        removeBtn.setAttribute('onclick', `deleteHero('${avenger.id}')`)
        removeBtn.innerText = 'Remove Hero'

        li.setAttribute('id', avenger.id)
        li.classList = 'hero-container';
        // Set class to specific if a class is defined
        if (avenger.class) {
          li.classList.add(avenger.class);
        }

        // Append buttons to the li
        li.appendChild(document.createTextNode(avenger.name))
        li.appendChild(infoBtn)
        li.appendChild(removeBtn)

        // Append to list
        nameList.appendChild(li)
      }
    })
    .catch(err => {
      console.log(err)
    })
}

const addHero = () => {
  const _csrf = document.getElementById('_csrf').value // Grab the value of our csrfToken
  // Get Hero details
  const newName = document.getElementById('newName').value;
  const realName = document.getElementById('realName').value;
  const heroStyle = document.getElementById('heroStyle').value;
  const heroId = `newAv-${Date.now().toString()}`;

  fetch('/prove/11/insert', {
      method: 'POST', // Send a POST request
      headers: {
        // Set the Content-Type, since our server expects JSON
        'Content-Type': 'application/json',
        // Add the csrfToken
        'CSRF-Token': _csrf
      },
      body: JSON.stringify({
        newName,
        realName,
        heroStyle,
        heroId
      })
    })
    .then(res => {
      // Clear the input
      document.getElementById('newName').value = ''
      document.getElementById('realName').value = ''
      document.getElementById('heroStyle').value = 'hero-container';

      // Repopulate the list with our new name added
      populateList();

      // Tell the server to broadcast changes to other users
      socket.emit('new-hero');
    })
    .catch(err => {
      // Clear the input
      document.getElementById('newName').value = ''
      document.getElementById('realName').value = ''
      document.getElementById('heroStyle').value = 'hero-container'
      console.log(err)
    })
}

const deleteHero = (id) => {
  const _csrf = document.getElementById('_csrf').value // Grab the value of our csrfToken
  // Get Hero id
  const heroId = id;
  fetch('/prove/11/delete', {
      method: 'POST', // Send a POST request
      headers: {
        'Content-Type': 'application/json',
        // Add the csrfToken
        'CSRF-Token': _csrf
      },
      body: JSON.stringify({
        heroId
      })
    })
    .then(res => {
      // Repopulate the list
      populateList()
      socket.emit('remove-hero');
    })
    .catch(err => {
      // Clear the input
      document.getElementById('newName').value = ''
      document.getElementById('realName').value = ''
      document.getElementById('heroStyle').value = 'hero-container'
      console.log(err)
    })
}

const getInfo = (id) => {
  const _csrf = document.getElementById('_csrf').value // Grab the value of our csrfToken
  // Get Hero id
  const heroId = id;
  fetch('/prove/11/info', {
      method: 'POST', // Send a POST request
      headers: {
        'Content-Type': 'application/json',
        // Add the csrfToken
        'CSRF-Token': _csrf
      },
      body: JSON.stringify({
        heroId
      })
    })
    .then(res => res.json())
    .then(details => {
      console.log(details);
      populateInfo(id, details);
    })
    .catch(err => {
      console.log(err)
    })
}

const populateInfo = (id, info) => {
  const container = document.querySelector(`#${id}`);
  const detail = document.createElement('p');
  detail.innerText = info.secret_identity;
  container.appendChild(detail)
}

// Initialize the list
populateList()