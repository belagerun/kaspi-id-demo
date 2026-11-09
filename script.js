const documentCard = document.getElementById('document');
const requisitesCard = document.getElementById('requisites');
const qrModal = document.getElementById('qrModal');

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const showRequisites = tab.textContent.trim() === 'Реквизиты';
    documentCard.hidden = showRequisites;
    requisitesCard.hidden = !showRequisites;
    document.querySelectorAll('.tab').forEach((item) => {
      item.classList.toggle('active', item === tab);
    });
  });
});

document.querySelectorAll('.primary').forEach((button) => {
  button.addEventListener('click', () => {
    qrModal.style.display = 'block';
  });
});

function closeModal() {
  qrModal.style.display = 'none';
}

qrModal.addEventListener('click', (event) => {
  if (event.target === qrModal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

document.querySelectorAll('.secondary').forEach((button) => {
  button.addEventListener('click', async () => {
    const pdfName = '060131500086-20250603111642292.pdf';
    const pdfUrl = new URL(pdfName, window.location.href).href;

    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error(`PDF request failed: ${response.status}`);
      const file = new File([await response.blob()], pdfName, { type: 'application/pdf' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'Удостоверение личности', files: [file] });
      } else {
        window.location.assign(pdfUrl);
      }
    } catch (error) {
      console.error('Could not open or share the document:', error);
      window.location.assign(pdfUrl);
    }
  });
});
