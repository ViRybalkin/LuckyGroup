const select = document.querySelectorAll('.select').forEach(select => {
  const selectHeader = select.querySelectorAll('.select__header');
  const selectItem = select.querySelectorAll('.select__item');
  const currentItem = select.querySelector('.select__current');

  selectHeader.forEach(item => {
    item.addEventListener('click', selectToggle);
  });

  selectItem.forEach(item => {
    item.addEventListener('click', selectChoose);
  });

  function selectToggle() {
    this.parentElement.classList.toggle('select-active');
  }

  function selectChoose() {
    const selectOption = this.textContent;
    const imgs = this.getAttribute('data-image');
    const thisSelect = this.closest('.select');
    currentItem.innerHTML = `${selectOption.trim()} <img src="${imgs}"/>`;

    thisSelect.classList.remove('select-active');
  }

  document.addEventListener('click', e => {
    if (!select.contains(e.target)) {
      select.classList.remove('select-active');
    }
  });
});
