const appBase = new URL('./', document.querySelector('link[rel="manifest"]').href);
const pdfName = document.querySelector('meta[name="pdf-file"]').content;
const pdfUrl = new URL(pdfName, appBase).href;
const qrDialog = document.querySelector('.qr-dialog');
const documentViewport = document.querySelector('.document-viewport');
const documentImage = document.querySelector('.identity-image');

if (documentViewport && documentImage) {
  let scale = 1;
  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let lastTap = 0;

  const setScale = (nextScale) => {
    scale = Math.min(3, Math.max(1, nextScale));
    documentImage.style.setProperty('--document-scale', scale);
  };

  const touchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  documentViewport.addEventListener('touchstart', (event) => {
    if (event.touches.length === 2) {
      pinchStartDistance = touchDistance(event.touches);
      pinchStartScale = scale;
    }
  }, { passive: true });

  documentViewport.addEventListener('touchmove', (event) => {
    if (event.touches.length === 2 && pinchStartDistance) {
      event.preventDefault();
      setScale(pinchStartScale * touchDistance(event.touches) / pinchStartDistance);
    }
  }, { passive: false });

  documentViewport.addEventListener('touchend', (event) => {
    if (event.touches.length < 2) pinchStartDistance = 0;
  }, { passive: true });

  documentViewport.addEventListener('dblclick', () => setScale(scale > 1 ? 1 : 2));
  documentViewport.addEventListener('touchend', (event) => {
    if (event.changedTouches.length !== 1) return;
    const now = Date.now();
    if (now - lastTap < 320) setScale(scale > 1 ? 1 : 2);
    lastTap = now;
  }, { passive: true });
}

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

document.querySelectorAll('[data-action="share-requisites"]').forEach((button) => {
  button.addEventListener('click', async () => {
    const lines = [...document.querySelectorAll('.requisites dl > div')].map((row) => {
      const label = row.querySelector('dt')?.textContent.trim();
      const value = row.querySelector('dd span')?.textContent.trim();
      return label && value ? `${label}: ${value}` : null;
    }).filter(Boolean);
    const text = lines.join('\n');

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Реквизиты документа', text });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        button.title = 'Реквизиты скопированы';
        window.setTimeout(() => { button.title = ''; }, 1800);
      } else {
        throw new Error('Share and clipboard APIs are unavailable');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Requisites sharing failed:', error);
      }
    }
  });
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.closest('dd').querySelector('span').textContent.trim();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const field = document.createElement('textarea');
        field.value = value;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.append(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Clipboard copy was denied');
      }

      button.title = 'Скопировано';
      button.setAttribute('aria-label', 'Скопировано: ' + value);
      button.style.color = '#8b9096';
      button.style.backgroundColor = 'transparent';
      window.setTimeout(() => {
        button.title = 'Скопировать';
      }, 1400);
    } catch (error) {
      console.error('Could not copy value:', error);
      button.title = 'Не удалось скопировать';
    }
  });
});
