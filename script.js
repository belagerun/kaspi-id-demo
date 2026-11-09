const rootPath = new URL('../', document.querySelector('link[rel="manifest"]').href);
const pdfName = document.querySelector('meta[name="pdf-file"]').content;
const pdfUrl = new URL(pdfName, rootPath).href;
const qrDialog = document.querySelector('.qr-dialog');

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-view]').forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.panel !== button.dataset.view;
    });
  });
});

document.querySelectorAll('[data-action="show-qr"]').forEach((button) => {
  button.addEventListener('click', () => qrDialog.showModal());
});

document.querySelector('[data-action="close-qr"]').addEventListener('click', () => qrDialog.close());

qrDialog.addEventListener('click', (event) => {
  if (event.target === qrDialog) qrDialog.close();
});

document.querySelectorAll('[data-action="share"]').forEach((button) => {
  button.addEventListener('click', async () => {
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
      console.error('Document sharing failed:', error);
      window.location.assign(pdfUrl);
    }
  });
});
