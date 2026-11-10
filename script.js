const appBase = new URL('./', document.querySelector('link[rel="manifest"]').href);
const pdfName = document.querySelector('meta[name="pdf-file"]').content;
const pdfUrl = new URL(pdfName, appBase).href;
const qrDialog = document.querySelector('.qr-dialog');
const documentViewport = document.querySelector('.document-viewport');
const documentImage = document.querySelector('.identity-image');
const homeScreen = document.querySelector('[data-screen="home"]');
const servicesScreen = document.querySelector('[data-screen="services"]');
const documentScreen = document.querySelector('[data-screen="document"]');
const egovScreen = document.querySelector('[data-screen="egov"]');
const documentsDialog = document.querySelector('.documents-dialog');
const infoDialog = document.querySelector('.info-dialog');
let documentReturnScreen = 'services';
let documentOpenTimer;
let selectedCategory = 'popular';
let toastTimer;

function showScreen(name) {
  window.clearTimeout(documentOpenTimer);
  document.querySelectorAll('[data-screen]').forEach((screen) => {
    screen.hidden = screen.dataset.screen !== name;
  });
  if (name === 'home') homeScreen.querySelector('.home-content').scrollTo({ top: 0 });
  if (name === 'services') servicesScreen.querySelector('.services-content').scrollTo({ top: 0 });
  if (name === 'document') documentViewport.scrollTo({ top: 0 });
}

function selectDocumentView(name) {
  document.querySelectorAll('[data-view]').forEach((tab) => {
    const active = tab.dataset.view === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  document.querySelectorAll('[data-panel]').forEach((panel) => { panel.hidden = panel.dataset.panel !== name; });
}

function showInfo(title, description, icon) {
  infoDialog.querySelector('h2').textContent = title;
  infoDialog.querySelector('.info-description').textContent = description;
  const image = infoDialog.querySelector('.info-icon');
  image.hidden = !icon;
  if (icon) image.src = icon;
  infoDialog.showModal();
}

document.querySelectorAll('[data-action="open-services"]').forEach((button) => {
  button.addEventListener('click', () => showScreen('services'));
});
document.querySelectorAll('[data-action="open-document"]').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('dialog')?.close();
    documentReturnScreen = button.dataset.origin || 'services';
    selectDocumentView('document');
    showScreen('egov');
    egovScreen.querySelector('.egov-close').focus({ preventScroll: true });
    documentOpenTimer = window.setTimeout(() => {
      showScreen('document');
      documentScreen.querySelector('.back-button').focus({ preventScroll: true });
    }, 1600);
  });
});
document.querySelector('[data-action="cancel-document"]').addEventListener('click', () => {
  showScreen(documentReturnScreen);
  servicesScreen.querySelector('[data-action="open-document"]').focus({ preventScroll: true });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !egovScreen.hidden) document.querySelector('[data-action="cancel-document"]').click();
});
document.querySelectorAll('[data-action="back-home"]').forEach((button) => {
  button.addEventListener('click', () => showScreen('home'));
});
document.querySelector('[data-action="back-from-document"]').addEventListener('click', () => showScreen(documentReturnScreen));
document.querySelector('[data-action="all-documents"]').addEventListener('click', () => documentsDialog.showModal());
document.querySelectorAll('[data-action="open-passport"]').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('dialog')?.close();
    showInfo('Паспорт гражданина РК', 'В демоверсии паспорт пока не загружен. Для него нужен отдельный файл; реквизиты удостоверения сюда не подставляются.', './assets/ui-kit/gov/11_badge_passport_rk_mini.png');
  });
});
document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog').close());
});
document.querySelectorAll('.documents-dialog, .info-dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});

document.querySelectorAll('[data-demo]').forEach((button) => {
  button.addEventListener('click', () => {
    const toast = document.querySelector('.demo-toast');
    window.clearTimeout(toastTimer);
    toast.textContent = button.dataset.demo + ': демонстрационный раздел, без подключения к сервису.';
    toast.hidden = false;
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2600);
  });
});


document.querySelector('.home-search input').addEventListener('input', (event) => {
  const query = event.target.value.trim().toLocaleLowerCase('ru');
  let matches = 0;
  homeScreen.querySelectorAll('.quick-service').forEach((button) => {
    button.hidden = !button.textContent.toLocaleLowerCase('ru').includes(query);
    if (!button.hidden) matches += 1;
  });
  homeScreen.querySelector('.home-search-empty').hidden = matches > 0;
});

document.querySelectorAll('[data-home-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-home-filter]').forEach((chip) => {
      chip.classList.toggle('active', chip === button);
      chip.setAttribute('aria-pressed', String(chip === button));
    });
    const index = Number(button.dataset.homeFilter);
    const title = ['Рекомендуем', 'Акции', 'Туры', 'Magnum'][index];
    const section = document.querySelector('.recent-products');
    section.querySelector('h2').textContent = title;
    section.querySelector('.product-row').hidden = index > 1;
    const note = section.querySelector('.collection-note');
    note.hidden = index <= 1;
    note.textContent = 'Подборка «' + title + '» доступна в приложении Kaspi.kz. Здесь показана демонстрация интерфейса.';
  });
});

function filterServices() {
  const query = document.querySelector('.services-search input').value.trim().toLocaleLowerCase('ru');
  let matches = 0;
  document.querySelectorAll('[data-service]').forEach((button) => {
    const categoryMatches = query || button.dataset.categories.split(' ').includes(selectedCategory);
    button.hidden = !categoryMatches || !button.textContent.toLocaleLowerCase('ru').includes(query);
    if (!button.hidden) matches += 1;
  });
  servicesScreen.querySelectorAll('.service-document-card').forEach((button) => {
    button.hidden = !button.getAttribute('aria-label').toLocaleLowerCase('ru').includes(query);
    if (!button.hidden && query) matches += 1;
  });
  const category = document.querySelector('[data-category="' + selectedCategory + '"]');
  document.querySelector('#services-heading').textContent = query ? 'Результаты поиска' : selectedCategory === 'popular' ? 'Популярные услуги' : category.textContent;
  document.querySelector('.services-empty').hidden = matches > 0;
}

document.querySelectorAll('[data-category]').forEach((button) => {
  button.addEventListener('click', () => {
    selectedCategory = button.dataset.category;
    document.querySelector('.services-search input').value = '';
    document.querySelectorAll('[data-category]').forEach((category) => {
      category.classList.toggle('active', category === button);
      category.setAttribute('aria-pressed', String(category === button));
    });
    filterServices();
  });
});
document.querySelector('.services-search input').addEventListener('input', filterServices);
document.querySelectorAll('[data-services-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-services-tab]').forEach((tab) => {
      tab.classList.toggle('active', tab === button);
      tab.setAttribute('aria-pressed', String(tab === button));
    });
    document.querySelectorAll('[data-services-panel]').forEach((panel) => { panel.hidden = panel.dataset.servicesPanel !== button.dataset.servicesTab; });
  });
});
document.querySelectorAll('[data-service]').forEach((button) => {
  button.addEventListener('click', () => showInfo(button.dataset.service, 'Демонстрационный раздел. Подача заявлений и получение справок здесь недоступны.', button.querySelector('img').src));
});

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
  button.addEventListener('click', () => selectDocumentView(button.dataset.view));
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
      if (error.name === 'AbortError') return;
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
