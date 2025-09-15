// Filtrage dynamique par statut
const filters = document.querySelectorAll('.filter');
const rows = document.querySelectorAll('tbody tr');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const status = btn.dataset.filter;

    rows.forEach(row => {
      row.style.display =
        status === 'all' || row.dataset.status === status ? '' : 'none';
    });
  });
});
