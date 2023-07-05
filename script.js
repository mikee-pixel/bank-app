"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP v2

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-12T14:18:46.235Z",
    "2023-06-25T05:33:06.386Z",
    "2023-06-26T14:43:26.374Z",
    "2023-06-27T12:49:59.371Z",
    "2023-06-28T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
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


//CURRENCY FORMATTER FUNCTION
const currencyFormatter = (currency) => {
  const option = {
    style: 'currency',
    currency: `${currentUser.currency}`
  }

  return Intl.NumberFormat(`${currentUser.locale}`, option).format(currency);
}


//TRANSACTION DATE FORMATTER FUNCTION
const calculationDateTransaction = (date) => {
  const calcDayPassed = (date1, date2) => {
    return Math.trunc((date2 - date1) / (1000 * 60 * 60 * 24));
  }

  const dateOption = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }

  const dayPassed = calcDayPassed(date, new Date());
  if (dayPassed === 0) return `TODAY`;
  else if (dayPassed === 1) return `YESTERDAY`;
  else if (dayPassed >= 2 && dayPassed <= 7) return `${dayPassed} DAYS AGO`;
  else return Intl.DateTimeFormat(`${currentUser.locale}`, dateOption).format(date);
}


//DISPLAY ACCOUNT MOVEMENTS
const displayAccountMov = (movements, isSort = false) => {
  containerMovements.innerHTML = '';

  const movs = isSort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, i) => {

    const dates = new Date(currentUser.movementsDates[i]);
    const dateConverter = calculationDateTransaction(dates);

    const typeDeposit = mov > 0 ? `deposit` : `withdrawal`;
    const htmlContent = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typeDeposit}">${i + 1} ${typeDeposit}</div>
        <div class="movements__date">${dateConverter}</div>
        <div class="movements__value">${currencyFormatter(mov)}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlContent);
  });
}



//CALCULATE THE ACCOUNT BALANCE
const displayAccountBalance = (movements) => {
  currentUser.accBal = movements.reduce((acc, curr) => acc += curr, 0);
  labelBalance.textContent = currencyFormatter(currentUser.accBal);
}



//CALCULATE TRANSACTION SUMMARY
const displayAccountSummary = (movements) => {
  const transcDesposit = movements.filter(mov => mov > 0).reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = currencyFormatter(transcDesposit);

  const transWithdraw = movements.filter(mov => mov < 0).reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = currencyFormatter(transWithdraw);

  const calcInterestRate = movements.filter(mov => mov > 0).map(deposit => (deposit * currentUser.interestRate) / 100).filter(interest => interest > 1).reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = currencyFormatter(calcInterestRate);

}



//SORTING DISPLAY TRANSACTION
let isSort = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayAccountMov(accounts[0].movements, !isSort);
  isSort = !isSort;
});



//UPDATE UI
const updateIU = () => {
  displayAccountMov(currentUser.movements)
  displayAccountBalance(currentUser.movements)
  displayAccountSummary(currentUser.movements);
}



//TRANSFER MONEY
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const accountReceiver = accounts.find(receiverUser => receiverUser.username === inputTransferTo.value);
  if (accountReceiver && Number(inputTransferAmount.value) > 0 && Number(inputTransferAmount.value) < currentUser.accBal) {
    currentUser.movements.push(Number(-inputTransferAmount.value));
    currentUser.movementsDates.push((new Date()).toISOString());

    accountReceiver.movements.push(Number(inputTransferAmount.value));
    accountReceiver.movementsDates.push((new Date()).toISOString());

    //Reset the timeout timer
    time = 300;

    updateIU();
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferAmount.blur();
  } else {
    console.error('Error Transaction');
  }
})



//REQUEST LOAN
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const requestLoan = currentUser.movements.some(deposit => deposit > inputLoanAmount.value * 0.1);
  if (requestLoan === true) {
    currentUser.movements.push(Number(inputLoanAmount.value));
    currentUser.movementsDates.push((new Date()).toISOString());

    //Reset the timeout timer
    time = 300;

    updateIU();
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  } else {
    //Show error message here
  }
})



//CLOSE/DELETE ACCOUNT
btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (inputCloseUsername.value === currentUser.username && Number(inputClosePin.value) === currentUser.pin) {
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
let currentUser, timer, time = 0;
// currentUser = account2;
// updateIU();



//TIMEOUT TIMER FUNCTION
const timeOutTimer = () => {

  const tick = () => {
    const minute = time / 60;
    const second = time % 60;
    time--;
    labelTimer.textContent = `${String(Math.trunc(minute)).padStart(2, 0)}:${String(second).padStart(2, 0)}`;
    console.log(`${String(Math.trunc(minute)).padStart(2, 0)}:${String(second).padStart(2, 0)}`);
    if (time === 0) {
      clearInterval(timer);
      navigation.classList.remove('active');
      containerApp.classList.remove('active');
      formMotherContainer.classList.remove('hidden');
    }
  }

  timer = setInterval(tick, 1000);
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
  navigation.classList.remove('active');
  containerApp.classList.remove('active');
  formMotherContainer.classList.remove('hidden');
  clearInterval(timer);

})