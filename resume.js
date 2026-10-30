const printButton = document.querySelector('#print-resume');
printButton.hidden = false;
printButton.addEventListener('click', () => window.print());
