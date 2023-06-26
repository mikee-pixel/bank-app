'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann', 
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
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



/*DISPLAY ACCOUNT MOVEMENTS*/
const displayAccountMov = (movements, isSort = false) => {
  containerMovements.innerHTML = '';
  
  const movs = isSort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach( (mov, numberOfTransc) => {
    // console.log(numberOfTransc);
    const typeDeposit = mov > 0 ? `deposit` : `withdrawal`;
    const htmlContent = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typeDeposit}">${numberOfTransc + 1} ${typeDeposit}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlContent);
  });
}




/*CALCULATE THE ACCOUNT BALANCE*/
const displayAccountBalance = (movements) => {
  const reducerValue = movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${reducerValue}€`;
}



/*CALCULATE TRANSACTION SUMMARY*/
const displayAccountSummary = (movements) => {
  const transcDesposit = movements.filter(mov => mov > 0).reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${transcDesposit}€`;

  const transWithdraw = movements.filter(mov => mov < 0).reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(transWithdraw)}€`;

  const calcInterestRate = movements.filter(mov => mov > 0).map(deposit => (deposit * currentUser.interestRate) / 100).filter(interest => interest > 1).reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `${calcInterestRate}€`;

}



/*SORTING DISPLAY TRANSACTION*/
let isSort = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Sort button is clicked!');
  displayAccountMov(accounts[0].movements, !isSort);
  isSort = !isSort;
  console.log(isSort);
});

//UPDATE UI
const updateIU = () => {
  displayAccountMov(currentUser.movements)
  displayAccountBalance(currentUser.movements)
  displayAccountSummary(currentUser.movements);
}

console.log(parseInt(labelBalance.textContent));

//TRANSFER MONEY
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const accountReceiver = accounts.find(receiverUser => receiverUser.username === inputTransferTo.value);
  if(accountReceiver && Number(inputTransferAmount.value) > 0 && Number(inputTransferAmount.value) < parseInt(labelBalance.textContent)){
    currentUser.movements.push(Number(-inputTransferAmount.value));
    accountReceiver.movements.push(Number(inputTransferAmount.value));
    updateIU();
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferAmount.blur();
  } else {
    //Show error message here
  }
})

//REQUEST LOAN
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const requestLoan = currentUser.movements.some(deposit => deposit > inputLoanAmount.value * 0.1);
  if(requestLoan === true){
    currentUser.movements.push(Number(inputLoanAmount.value));
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
let currentUser;

console.log();
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