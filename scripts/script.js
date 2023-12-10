'use strict';
// Modal window


const headerBurgerMenu = () => {
  const burgerMenu = document.querySelector('.burger__menu');
  const closeBtnMobile = document.querySelector('.close_btn_mobile');
  const navLinks = document.querySelector('.nav__links');

  burgerMenu.addEventListener('click', (e) => {
    console.log('Buger Menu is click!');
    e.preventDefault();
    navLinks.classList.add('active');
  })

  closeBtnMobile.addEventListener('click', (e) => {
    console.log('Close button is click!');
    e.preventDefault();
    navLinks.classList.remove('active');
  })
}

headerBurgerMenu();

const landingHandleFunc = () => {
  const navItems = document.querySelector('.nav__links');
  const btnContainer = document.querySelector('.operations__tab-container');
  const btnTabs = document.querySelectorAll('.operations__tab');
  const nav = document.querySelector('.nav');
  const tabContainer = document.querySelectorAll('.operations__content');
  const slider = document.querySelectorAll('.slide');
  const btnSliderLeft = document.querySelector('.slider__btn--left');
  const btnSliderRight = document.querySelector('.slider__btn--right');
  let currentSlider = 0;
  const dots = document.querySelector('.dots');


  //PAGE NAVIGATION USING BUBBLING AND CAPTURING 
  navItems.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('nav_item_fade')) {
      const itemLink = document.querySelector(`${e.target.getAttribute('href')}`);
      itemLink.scrollIntoView({ behavior: 'smooth' });
    }
  })

  // TABBED COMPONENTS
  btnContainer.addEventListener('click', (e) => {
    console.log(e.target);
    const clicked = e.target.closest('.operations__tab');

    //To remove & add the ACTIVE class for each of the button.
    btnTabs.forEach(btn => btn.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    //To remove & add the ACTIVE class for each of the container tab
    tabContainer.forEach(tab => tab.classList.remove('operations__content--active'));
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
  })

  //MENU FADE ANIMATION
  const navLinks = document.querySelector('.nav__links');
  const handleHover = function (e) {
    if (e.target.classList.contains('nav_item_fade')) {
      const activeHover = e.target;
      const navSiblings = activeHover.closest('.nav__links').querySelectorAll('.nav_item_fade');

      navSiblings.forEach(el => {
        if (el !== activeHover) el.style.opacity = this;
      })
    }
  }
  //Passing "argument" in handler
  navLinks.addEventListener('mouseover', handleHover.bind(0.5));
  navLinks.addEventListener('mouseout', handleHover.bind(1));



  //STICKY NAVIGATION
  const header = document.querySelector('.header');
  const navHeight = nav.getBoundingClientRect().height;

  const stickyFunct = (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        document.querySelector('.nav').classList.add('sticky');
      } else {
        document.querySelector('.nav').classList.remove('sticky');
      }
    })
  }

  const headerObserver = new IntersectionObserver(stickyFunct, {
    root: null,
    threshold: [0, 0.2],
    rootMargin: `-${navHeight}px`,
  })
  headerObserver.observe(header);

  //REVEALING ELEMENTS ON SCROLL
  const optionSectionObs = {
    root: null,
    threshold: 0.15,
  }

  const functSectionObs = (entries, observer) => {
    // console.log(entries[0]);
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      else entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    })
  }

  const sectionObserver = new IntersectionObserver(functSectionObs, optionSectionObs);

  const sectionContainers = document.querySelectorAll('.section');

  sectionContainers.forEach(sectionContainer => {
    sectionObserver.observe(sectionContainer);
    sectionContainer.classList.add('section--hidden');
  })


  //LAZY LOADING
  const lazyImg = document.querySelectorAll('img[data-src]');

  const optionImageObs = {
    root: null,
    threshold: 0.15,
  }

  const functImageObs = (entries, observer) => {
    if (!entries[0].isIntersecting) return;
    else {
      entries[0].target.src = entries[0].target.dataset.src;
      entries[0].target.addEventListener('load', () => {
        entries[0].target.classList.remove('lazy-img');
      })
    }
  }

  const imageObserver = new IntersectionObserver(functImageObs, optionImageObs);
  lazyImg.forEach(img => {
    imageObserver.observe(img);
  });


  //To add transform translateX 100% style incrementally for each of item slide: 100%, 200%, 300%
  slider.forEach((itemSlide, i) => {
    itemSlide.style.transform = `translateX(${i * 100}%)`;
  })


  //CREATE DOTS NAVIGATION
  slider.forEach((_, i) => {
    const btnDotHTML = `<button class="dots__dot" data-slide="${i}"></button>`;
    dots.insertAdjacentHTML('beforeend', btnDotHTML);
  })


  const activatingDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    })
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }

  activatingDot(currentSlider);

  //ADDING FUNCTION TO ARROW LEFT BUTTON SLIDER
  const goToSlide = function (currentSlide) {
    slider.forEach((itemSlider, i) => {
      itemSlider.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    })
  }

  const nextSlide = () => {
    if (currentSlider === slider.length - 1) currentSlider = 0;
    else currentSlider++;
    console.log('Key arrow right is pressed');
    goToSlide(currentSlider);
    activatingDot(currentSlider);
  }

  const prevSlide = () => {
    if (currentSlider === 0) currentSlider = slider.length - 1;
    else currentSlider--;
    console.log('Key arrow left is pressed');
    goToSlide(currentSlider);
    activatingDot(currentSlider);
  }

  //DOTS NAVIGATIONS EVENT LISTENERS
  dots.addEventListener('click', (e) => {
    console.log(e);

    if (e.target.classList.contains('dots__dot')) {
      const clickedDOT = e.target.dataset.slide;
      goToSlide(clickedDOT);
      activatingDot(clickedDOT);
    }
  })


  //Everytime arrow button is trigger the transform translateX value for each of item slide will increment by 100%
  btnSliderRight.addEventListener('click', nextSlide)

  //Everytime arrow button is trigger the transform translateX value for each of item slide will decrement by 100%
  btnSliderLeft.addEventListener('click', prevSlide)


  //ADDING EVENTLISTENER FOR LEFT AND RIGHT ARROW KEYS
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    // sliderDotNav(currentSlider); this creates an error to the code.
    activatingDot(currentSlider);
  })
}

landingHandleFunc();



