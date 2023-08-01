'use strict';

///////////////////////////////////////
// Modal window

// const modal = document.querySelector('.modal');
const formMainContainer = document.querySelector('.form-main-container')
const overlay = document.querySelector('.form-overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navItems = document.querySelector('.nav__links');
const btnContainer = document.querySelector('.operations__tab-container');
const btnTabs = document.querySelectorAll('.operations__tab');
const nav = document.querySelector('.nav');
const tabContainer = document.querySelectorAll('.operations__content');

const openModal = function () {
  formMainContainer.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  formMainContainer.classList.add('hidden');
  overlay.classList.add('hidden');
};


for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});



//PAGE NAVIGATION USING BUBBLING AND CAPTURING 
navItems.addEventListener('click', (e) => {
  e.preventDefault();
  if(e.target.classList.contains('nav_item_fade')){
    const itemLink = document.querySelector(`${e.target.getAttribute('href')}`);
    itemLink.scrollIntoView({behavior: 'smooth'});
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
const handleHover = function(e) {
  if(e.target.classList.contains('nav_item_fade')){
    const activeHover = e.target;
    const navSiblings = activeHover.closest('.nav__links').querySelectorAll('.nav_item_fade');

    navSiblings.forEach(el => {
      if(el !== activeHover) el.style.opacity = this;
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
  entries.forEach(entry =>{
    if(!entry.isIntersecting){
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
    if(!entry.isIntersecting) return 
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

  if(!entries[0].isIntersecting) return;
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
})



const slider = document.querySelectorAll('.slide');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
let currentSlider = 0;
const dots = document.querySelector('.dots');

//IN THE MEAN TIME SCALE DOWN THE SLIDER
const sliderContainer = document.querySelector('.slider');
// sliderContainer.style.transform = `scale(0.5)`;
// sliderContainer.style.overflow = 'visible';


//To add transform translateX 100% style incrementally for each of item slide: 100%, 200%, 300%
slider.forEach((itemSlide, i) => {
  itemSlide.style.transform = `translateX(${i * 100}%)`;
})


//CREATE DOTS NAVIGATION
slider.forEach((_, i) => {
  const btnDotHTML = `<button class="dots__dot" data-slide="${i}"></button>`;
  dots.insertAdjacentHTML('beforeend', btnDotHTML);  
})


const activatingDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  })
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

activatingDot(currentSlider);


//ADDING FUNCTION TO ARROW LEFT BUTTON SLIDER
const goToSlide = function(currentSlide){
  slider.forEach((itemSlider, i) => {
    itemSlider.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  })
}

const nextSlide = () => {
  if(currentSlider === slider.length - 1) currentSlider = 0;
  else currentSlider++;
  console.log('Key arrow right is pressed');
  goToSlide(currentSlider);
  activatingDot(currentSlider);
}

const prevSlide = () => {
  if(currentSlider === 0) currentSlider = slider.length - 1;
  else currentSlider--;
  console.log('Key arrow left is pressed');
  goToSlide(currentSlider);
  activatingDot(currentSlider);
}

//DOTS NAVIGATIONS EVENT LISTENERS
dots.addEventListener('click', (e) => {
  console.log(e);
  
  if(e.target.classList.contains('dots__dot')){
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
  console.log(e);
  if(e.key === 'ArrowRight') nextSlide();
  if(e.key === 'ArrowLeft') prevSlide();
  sliderDotNav(currentSlider);
  activatingDot(currentSlider);
})




//SCRIPT FOR LOGIN FORM
const signInErrorMessage = document.querySelector('.signin-error-message');
// const formMainContainer = document.querySelector('.form-main-container');
const signInContainer = document.querySelector('.sign-in-container');
const signUpContainer = document.querySelector('.sign-up-container');
const overlayBtnSignIn = document.querySelector('.overlay-btn-signin');
const overlayBtnSignUp = document.querySelector('.overlay-btn-signup');
const btnSignIn = document.querySelector('.btn-sign-in');
const btnLogOut = document.querySelector('#logout-btn');
const btnSignUpMobile = document.querySelector('.btn-signup-mobile');
const btnSignInMobile = document.querySelector('.btn-sign-in-mobile');
const signInEmailInput = document.querySelector('.sign-in-container .email-input-field');
const signInPassInput = document.querySelector('.sign-in-container .password-input-field');


//LOGIN FORM FUNCTION & LOGIN
overlayBtnSignUp.addEventListener('click', () => {
  formMainContainer.classList.add('switching-active');
  console.log('SignUp button is clicked!');
})

overlayBtnSignIn.addEventListener('click', () => {
  formMainContainer.classList.remove('switching-active');
  console.log('SignIn button is clicked!');
})

btnSignIn.addEventListener('click', (e) => {
  e.preventDefault();
  currentUser = accounts.find(acc => acc.username === signInEmailInput.value);
  // console.log(currentUser);
  if (currentUser && currentUser.pin === Number(signInPassInput.value)) {
    //Timer initiate
    timeOutTimer();
    time = 300;

    //To hide the login form and display the app
    formMotherContainer.classList.add('hidden');
    containerApp.classList.add('active');
    navigation.classList.add('active');

    //To show the date
    const dateNow = new Date();
    const dateTimeFormatter = (date) => {
      const option = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }
      return Intl.DateTimeFormat(`${currentUser.locale}`, option).format(date);
    }
    labelDate.textContent = dateTimeFormatter(dateNow);


    //Update the UI every time user login
    updateIU();

    //Greeting to user
    labelWelcome.textContent = `Welcome back! ${currentUser.owner.split(" ")[0]},`;
    userNamex.textContent = `${currentUser.owner.split(" ")[0]} ${currentUser.owner.split(" ").slice(-1).map(word => word[0])}.`;
    signInEmailInput.value = signInPassInput.value = "";

  } else if (signInEmailInput.value === '' || signInPassInput === '') {    
    displayErrorFunc();
  }
  else {
    signInErrorMessage.classList.add('active');
    signInErrorMessage.textContent = '*This user does not exists';
  }
})


//FORM MOBILE FUNCTION
btnSignUpMobile.addEventListener('click', () => {
  console.log('Sign Up button mobile clicked');
  signInContainer.classList.add('hide-mobile');
  signUpContainer.classList.add('active-mobile');
})

btnSignInMobile.addEventListener('click', () => {
  signInContainer.classList.remove('hide-mobile');
  signUpContainer.classList.remove('active-mobile');
})