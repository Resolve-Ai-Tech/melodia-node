const socket = io();

function joinRoom() {
  const room = document.getElementById('room').value;
  socket.emit('join-room', room);
}

function addSong() {
  const room = document.getElementById('room').value;
  const song = document.getElementById('song').value;
  socket.emit('add-song', room, song);

  document.getElementById('song').value = '';
}

socket.on('song-added', (song) => {
  addSongToTable(song);
});

// Adiciona o ouvinte de evento para 'remove-song' apenas uma vez
socket.on('remove-song', (song) => {
  removeSongFromTable(song);
});

function addSongToTable(song) {
  const table = document.querySelector('table tbody');
  const nextNumber = table.rows.length + 1;

  const newRow = document.createElement('tr');

  // Criação das células da tabela
  const cells = [
    nextNumber, song, 'Unknown Artist', 'Unknown Album', '0:00'
  ];

  cells.forEach(cellText => {
    const cell = document.createElement('td');
    cell.textContent = cellText;
    newRow.appendChild(cell);
  });

  // Criação do botão de remover
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove-button';
  removeButton.addEventListener('click', () => {
    table.removeChild(newRow);
    const room = document.getElementById('room').value;
    socket.emit('remove-song', room, song);
  });

  // Adiciona o botão à última célula
  const actionCell = document.createElement('td');
  actionCell.appendChild(removeButton);
  newRow.appendChild(actionCell);

  // Adiciona a nova linha à tabela
  table.appendChild(newRow);
}

function removeSongFromTable(songTitle) {
  const table = document.querySelector('table tbody');
  const rows = table.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName('td');
    const titleCell = cells[1]; // A célula 1 é o título da música

    if (titleCell.textContent === songTitle) {
      table.deleteRow(i);
      break;
    }
  }
}