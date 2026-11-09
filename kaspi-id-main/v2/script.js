// Открытие QR-модального окна
function closeModal() {
  document.getElementById('qrModal').style.display = 'none';
}

// Нажатие "Отправить документ" — делимся PDF или открываем его
document.querySelector('.secondary').addEventListener('click', async () => {
  const pdfUrl = '060131500086-20250603111642292.pdf'; // Имя файла — должен быть рядом с HTML
  const pdfName = '060131500086-20250603111642292.pdf';

  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error(`PDF request failed: ${response.status}`);
    const blob = await response.blob();
    const file = new File([blob], pdfName, { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Удостоверение личности',
        text: 'Моё удостоверение личности',
        files: [file],
      });
    } else {
      window.location.href = pdfUrl;
    }
  } catch (err) {
    // alert('Не удалось поделиться файлом'); // убрали уведомление
    console.error(err); // можно оставить для разработчика
  }
});
