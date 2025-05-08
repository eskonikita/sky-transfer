/* === слайдер «Водители» ================================================ */
const driversSwiper = new Swiper('.swiper', {
    loop: true,
    slidesPerView: 1.1,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next-drivers',
      prevEl: '.swiper-button-prev-drivers',
    },
    breakpoints: {
      768: { slidesPerView: 2, spaceBetween: 40, enabled: false },
      992: { slidesPerView: 4, spaceBetween: 40, enabled: false },
    },
  });
  
  /* === после полной загрузки разметки ==================================== */
  document.addEventListener('DOMContentLoaded', () => {
  
    /* FAQ‑аккордеон (одновременное раскрытие только одного пункта) */
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.faq-item').forEach(el => {
          if (el !== item) el.classList.remove('active');
        });
        item.classList.toggle('active');
      });
    });
  
    /* табы «Классы автомобилей» */
    initTabs('.car-tabs__button', '.car-tabs__content');
  
    /* табы «Популярные направления» */
    initTabs('.routes__tab', '.routes__tab-content');
  
    /* запрет прокрутки <body> при открытом боковом меню
       (работает только на экранах < 768 px) */
    const sideCb   = document.getElementById('side-checkbox');
    const htmlRoot = document.documentElement;
  
    sideCb.addEventListener('change', () => {
      if (window.innerWidth >= 768) return;
      const method = sideCb.checked ? 'add' : 'remove';
      document.body.classList[method]('no-scroll');
      htmlRoot.classList[method]   ('no-scroll'); // для iOS
    });
  
    /* кастомные селекты .c-select */
    document.querySelectorAll('.c-select').forEach(setupCustomSelect);
  
    /* дропдаун выбора города (синхронизируются между собой) */
    initCityDropdowns();
  });
  
  /* ----------------------------------------------------------------------- */
  /* универсальная функция переключателя табов */
  function initTabs(btnSelector, contentSelector) {
    const buttons  = document.querySelectorAll(btnSelector);
    const contents = document.querySelectorAll(contentSelector);
  
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
  
        contents.forEach(c => c.classList.remove('is-visible'));
        document.getElementById(btn.dataset.target).classList.add('is-visible');
      });
    });
  }
  
  /* ----------------------------------------------------------------------- */
  /* кастомный селект (.c-select) */
  function setupCustomSelect(select) {
    const trigger = select.querySelector('.c-select__trigger');
    const label   = select.querySelector('.c-select__label');
    const list    = select.querySelector('.c-select__list');
    const hidden  = select.querySelector('input[type="hidden"]');
  
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      select.classList.toggle('open');
    });
  
    list.addEventListener('click', e => {
      const item = e.target.closest('.c-select__item');
      if (!item) return;
      label.textContent = item.dataset.value;
      hidden.value      = item.dataset.value;
      select.classList.remove('open');
    });
  }
  
  document.addEventListener('click', () => {
    document.querySelectorAll('.c-select.open')
            .forEach(s => s.classList.remove('open'));
  });
  
  /* ----------------------------------------------------------------------- */
  /* выпадающие списки выбора города (.city-dropdown)                        */
  function initCityDropdowns() {
  
    /* список городов */
    const CITIES = [
      { code: 'nsk', title: 'Новосибирск'      },
      { code: 'msk', title: 'Москва'           },
      { code: 'spb', title: 'Санкт‑Петербург'  },
      { code: 'ekb', title: 'Екатеринбург'     },
      { code: 'kzn', title: 'Казань'           },
    ];
  
    let currentCity = localStorage.getItem('cityCode') || CITIES[0].code;
  
    /* инициализация каждого дропдауна */
    document.querySelectorAll('.city-dropdown').forEach(dropdown => {
      const btn   = dropdown.querySelector('.city-current');
      const name  = dropdown.querySelector('.city-name');
      const list  = dropdown.querySelector('.city-list');
  
      list.innerHTML = CITIES.map(c =>
        `<li role="option" data-code="${c.code}">${c.title}</li>`).join('');
  
      updateCaption();
  
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        closeAllCityLists();
        if (!isOpen) openList();
      });
  
      list.addEventListener('click', e => {
        const li = e.target.closest('[data-code]');
        if (!li) return;
        currentCity = li.dataset.code;
        localStorage.setItem('cityCode', currentCity);
        syncAllCaptions();
        closeAllCityLists();
      });
  
      /* helpers */
      function openList() {
        btn.setAttribute('aria-expanded', 'true');
        list.classList.add('show');
      }
      function updateCaption() {
        name.textContent = CITIES.find(c => c.code === currentCity).title;
      }
      dropdown.updateCaption = updateCaption;
    });
  
    function syncAllCaptions() {
      document.querySelectorAll('.city-dropdown')
              .forEach(dd => dd.updateCaption());
    }
  
    function closeAllCityLists() {
      document.querySelectorAll('.city-dropdown').forEach(dd => {
        dd.querySelector('.city-current').setAttribute('aria-expanded', 'false');
        dd.querySelector('.city-list').classList.remove('show');
      });
    }
    document.addEventListener('click', closeAllCityLists);
  }
  