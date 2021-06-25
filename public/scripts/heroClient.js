const populateList = () => {
  const nameList = document.getElementById('heroList')

  fetch('/prove/10/fetchAll')
    .then(res => res.json())
    .then(data => {
      // Clear the list first
      while (nameList.firstChild) nameList.firstChild.remove()

      // Repopulate the list
      for (const avenger of data.avengers) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.setAttribute('onclick', `deleteHero('${avenger.id}')`)
        btn.innerText = 'Remove Hero'
        li.classList = 'hero-container';
        if (avenger.class) {
          li.classList.add(avenger.class);
        }
        li.appendChild(document.createTextNode(avenger.name))
        li.appendChild(btn)
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
  const d = new Date();
  const heroId = d.toString();

  fetch('/prove/10/insert', {
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
      document.getElementById('heroStyle').value = 'hero-container'

      // Repopulate the list with our new name added
      populateList()
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
  fetch('/prove/10/delete', {
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
    })
    .catch(err => {
      // Clear the input
      document.getElementById('newName').value = ''
      document.getElementById('realName').value = ''
      document.getElementById('heroStyle').value = 'hero-container'
      console.log(err)
    })
}

// Initialize the list
populateList()