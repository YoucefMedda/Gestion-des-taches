function showModal(title, content) {
  // Supprimer une modale existante
  closeModal();

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';

  modalContainer.innerHTML = `
    <div class="modal-header">
      <h2>${title}</h2>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-content">
      ${content}
    </div>
  `;

  modalOverlay.appendChild(modalContainer);
  document.body.appendChild(modalOverlay);

  // Gérer la fermeture
  modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

function closeModal() {
  const modalOverlay = document.querySelector('.modal-overlay');
  if (modalOverlay) {
    modalOverlay.remove();
  }
}
