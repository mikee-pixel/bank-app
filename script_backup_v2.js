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
  // const btnScroll = document.querySelector('.btn--scroll-to');
  // const section1 = document.querySelector('#section--1');
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
  //IN THE MEAN TIME SCALE DOWN THE SLIDER
  // const sliderContainer = document.querySelector('.slider');

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
    console.log(e);
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    sliderDotNav(currentSlider);
    activatingDot(currentSlider);
  })
}

landingHandleFunc();



//LOGIN FORM FUNCTION & LOGIN
const formPopUpModal = () => {
  const formMainContainer = document.querySelector('.form-main-container')
  const overlay = document.querySelector('.form-overlay');
  const btnCloseModal = document.querySelector('.btn--close-modal');
  const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
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
}

formPopUpModal();


//BANK PORTAL APPLICATION SCRIPT
const bankPortalApp = () => {
  const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,
  
    movementsDates: [
      '2019-11-18T21:31:17.178Z',
      '2019-12-23T07:42:02.383Z',
      '2020-01-28T09:15:04.904Z',
      '2023-06-11T10:17:24.185Z',
      '2023-06-13T14:11:59.604Z',
      '2023-06-14T17:01:17.194Z',
      '2023-06-15T09:36:17.929Z',
      '2023-06-16T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
  };
  
  const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  
    movementsDates: [
      '2019-11-01T13:15:33.035Z',
      '2019-11-30T09:48:16.867Z',
      '2019-12-25T06:04:23.907Z',
      '2020-01-25T14:18:46.235Z',
      '2020-02-05T16:33:06.386Z',
      '2020-04-10T14:43:26.374Z',
      '2020-06-25T18:49:59.371Z',
      '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
  };
  
  const accounts = [account1, account2];
  console.log(accounts);
  
  // Elements
  const signInErrorMessage = document.querySelector('.signin-error-message');
  const labelWelcome = document.querySelector('.welcome');
  const userNamex = document.querySelector('.user-name');
  const labelDate = document.querySelector('.date');
  const labelBalance = document.querySelector('.balance__value');
  const labelSumIn = document.querySelector('.summary__value--in');
  const labelSumOut = document.querySelector('.summary__value--out');
  const labelSumInterest = document.querySelector('.summary__value--interest');
  const labelTimer = document.querySelector('.timer');
  
  const navigation = document.querySelector('nav');
  const formMotherContainer = document.querySelector('.form-mother-container');
  const formMainContainer = document.querySelector('.form-main-container');
  const signInContainer = document.querySelector('.sign-in-container');
  const signUpContainer = document.querySelector('.sign-up-container');
  const containerApp = document.querySelector('.app');
  const containerMovements = document.querySelector('.movements');
  const overlayBtnSignIn = document.querySelector('.overlay-btn-signin');
  const overlayBtnSignUp = document.querySelector('.overlay-btn-signup');
  
  const btnSignIn = document.querySelector('.btn-sign-in');
  const btnLogOut = document.querySelector('#logout-btn');
  // const btnLogin = document.querySelector('.login__btn');
  const btnTransfer = document.querySelector('.form__btn--transfer');
  const btnLoan = document.querySelector('.form__btn--loan');
  const btnClose = document.querySelector('.form__btn--close');
  const btnSort = document.querySelector('.btn--sort');
  
  const signInEmailInput = document.querySelector('.sign-in-container .email-input-field');
  const signInPassInput = document.querySelector('.sign-in-container .password-input-field');
  // const inputLoginUsername = document.querySelector('.login__input--user');
  // const inputLoginPin = document.querySelector('.login__input--pin');
  const inputTransferTo = document.querySelector('.form__input--to');
  const inputTransferAmount = document.querySelector('.form__input--amount');
  const inputLoanAmount = document.querySelector('.form__input--loan-amount');
  const inputCloseUsername = document.querySelector('.form__input--user');
  const inputClosePin = document.querySelector('.form__input--pin');
  
  
  
  //TRANSACTION DAY CALCULATION
  const calcDateTrans = (date) => {
    const calcDayPassed = (date1, date2) => {
      return Math.round((date2 - date1) / (1000 * 60 * 60 * 24));
    }
  
    const dayPassed = calcDayPassed(date, new Date() );
    const dateTimeOption = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }
  
    if(dayPassed === 0) return `Today`;
    if(dayPassed === 1) return `Yesterday`;
    if(dayPassed < 7) return `${dayPassed} days ago`;
    else{
      return new Intl.DateTimeFormat(currentUser.locale, dateTimeOption).format(date);
    }
  }
  
  //FUNCTION FOR CURRENCY FORMATTER USING INTL.
  const currencyFormatter = (currency) => {
    const option = {
      style: 'currency',
      currency: `${currentUser.currency}`
    }
  
    return new Intl.NumberFormat(currentUser.currency, option).format(currency);
  }
  
  /*DISPLAY ACCOUNT MOVEMENTS*/
  const displayAccountMov = (acc, isSort = false) => {
    containerMovements.innerHTML = '';
    
    const movs = isSort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
    
    movs.forEach( (mov, i) => {
      //Date Formatting using Intl.
      const date = new Date(acc.movementsDates[i]);
      const transDate = calcDateTrans(date);
  
      const typeDeposit = mov > 0 ? `deposit` : `withdrawal`;
      const htmlContent = `
        <div class="movements__row">
          <div class="movements__type movements__type--${typeDeposit}">${i + 1} ${typeDeposit}</div>
          <div class="movements__date">${transDate}</div>
          <div class="movements__value">${currencyFormatter(mov)}</div>
        </div>
      `;
      containerMovements.insertAdjacentHTML('afterbegin', htmlContent);
    });
  }
  
  
  /*CALCULATE THE ACCOUNT BALANCE*/
  const displayAccountBalance = (movements) => {
    const reducerValue = movements.reduce((acc, curr) => acc + curr, 0);
    labelBalance.textContent = currencyFormatter(reducerValue);
  }
  
  /*CALCULATE TRANSACTION SUMMARY*/
  const displayAccountSummary = (movements) => {
  
    const transcDesposit = movements.filter(mov => mov > 0).reduce((acc, curr) => acc + curr, 0);
    labelSumIn.textContent = currencyFormatter(transcDesposit);
  
    const transWithdraw = movements.filter(mov => mov < 0).reduce((acc, curr) => acc + curr, 0);
    labelSumOut.textContent = currencyFormatter(transWithdraw);
  
    const calcInterestRate = movements.filter(mov => mov > 0).map(deposit => (deposit * currentUser.interestRate) / 100).filter(interest => interest > 1).reduce((acc, curr) => acc + curr, 0);
    labelSumInterest.textContent = currencyFormatter(calcInterestRate);
  
  }
  
  
  /*SORTING DISPLAY TRANSACTION*/
  let isSort = false;
  btnSort.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Sort button is clicked!');
    displayAccountMov(currentUser, !isSort);
    isSort = !isSort;
    console.log(isSort);
  });
  
  
  //UPDATE UI
  const updateIU = () => {
    displayAccountMov(currentUser)
    displayAccountBalance(currentUser.movements)
    displayAccountSummary(currentUser.movements);
  }
  
  //TRANSFER MONEY
  btnTransfer.addEventListener('click', (e) => {
    e.preventDefault();
    const accountReceiver = accounts.find(receiverUser => receiverUser.username === inputTransferTo.value);
    if(accountReceiver && Number(inputTransferAmount.value) > 0 /*&& Number(inputTransferAmount.value) < parseInt(labelBalance.textContent)*/){
      console.log('Transaction sucessful!');
      currentUser.movements.push(Number(-inputTransferAmount.value));
      currentUser.movementsDates.push(new Date().toISOString());
  
      accountReceiver.movements.push(Number(inputTransferAmount.value));
      accountReceiver.movementsDates.push(new Date().toISOString());
      updateIU();
      inputTransferAmount.value = inputTransferTo.value = "";
      inputTransferAmount.blur();
  
      // Reset timer
      clearInterval(timer);
      timer = startLoOutTimer();
    } else {
      //Show error message here
      console.log('transaction failed');
    }
  })
  
  //REQUEST LOAN
  btnLoan.addEventListener('click', (e) => {
    e.preventDefault();
    const requestLoan = currentUser.movements.some(deposit => deposit > inputLoanAmount.value * 0.1);
    if(requestLoan === true){
      setTimeout(() => {
        currentUser.movements.push(Number(inputLoanAmount.value));
        currentUser.movementsDates.push(new Date().toISOString());
        updateIU();
        inputLoanAmount.value = '';
        inputLoanAmount.blur();
  
        // Reset timer
        clearInterval(timer);
        timer = startLoOutTimer();
      }, 2000);
      
      
    } else {
      //Show error message here
    }
  })
  
  //CLOSE/DELETE ACCOUNT
  btnClose.addEventListener('click', (e) => {
    e.preventDefault();
    if(inputCloseUsername.value === currentUser.username && Number(inputClosePin.value) === currentUser.pin){
      const accDeleted = accounts.findIndex(acc => acc.username === inputCloseUsername.value);
      accounts.splice(accDeleted, 1);
      containerApp.classList.remove('active');
      navigation.classList.remove('active');
      formMotherContainer.classList.remove('hidden');
    }
  
  
  })
  
  
  //CREATE ACCOUNT USER NAME
  const accountUserName = accounts.map(acc => acc.username = acc.owner.toLowerCase().split(' ').map(initials => initials[0]).join(''));
  
  
  
  //USER LOGIN
  let currentUser, timer;
  // currentUser = account1;
  // updateIU();
  
  
  //Timer before the user will be logout
  const startLoOutTimer = () => {
    let time = 30;
    const tick = () => {
      let minute = String(Math.trunc(time / 60)).padStart(2, 0);
      let second = String(time % 60).padStart(2, 0);
  
      labelTimer.textContent = `${minute}:${String(second).padStart(2, 0)}`;
      console.log(`${minute}:${String(second).padStart(2, 0)}`);
  
      //current user will be logout
      if(time === 0){
        clearInterval(timer);
        navigation.classList.remove('active');
        containerApp.classList.remove('active');
        formMotherContainer.classList.remove('hidden');
        console.log('User will be now logout');
      }
  
      time--;
    }
  
    tick();
    const timer = setInterval(tick, 1000)
    return timer;
  }
  
  
  
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
    console.log(currentUser);
    if(currentUser && currentUser.pin === Number(signInPassInput.value)){
      formMotherContainer.classList.add('hidden');
      containerApp.classList.add('active');
      navigation.classList.add('active');
  
      //To update the time clock in real time
      setInterval(() => {
        const dateNow = new Date();
        const timeDateOption = {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        }
        const userLocale = currentUser.locale;
        labelDate.textContent = new Intl.DateTimeFormat(userLocale, timeDateOption).format(dateNow);
  
      }, 1000)
  
      if(timer) clearInterval(timer);
      timer = startLoOutTimer();
  
      updateIU();
  
      labelWelcome.textContent = `Welcome back! ${currentUser.owner.split(" ")[0]},`;
      userNamex.textContent = `${currentUser.owner.split(" ")[0]} ${currentUser.owner.split(" ").slice(-1).map(word => word[0])}.`;
      signInEmailInput.value = signInPassInput.value = "";
  
    } else if (signInEmailInput.value === '' || signInPassInput === ''){
      signInErrorMessage.classList.add('active');
      signInErrorMessage.textContent = '*Input field(s) cannot be empty';
    } 
    else {
      signInErrorMessage.classList.add('active');
      signInErrorMessage.textContent = '*This user does not exists';
    }
  })
  
  
  
  //USER LOGOUT
  btnLogOut.addEventListener('click', () => {
    console.log('Logout button is clicked!');
    navigation.classList.remove('active');
    containerApp.classList.remove('active');
    formMotherContainer.classList.remove('hidden');
  })
}

bankPortalApp()