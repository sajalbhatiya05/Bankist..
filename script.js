// BANKIST APP

// Data
const account1 = {
  owner: "Sajal Jain",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 3517,

  movementsDates: [
    "2023-11-18T21:31:17.178Z",
    "2023-12-23T07:42:02.383Z",
    "2023-04-28T09:15:04.904Z",
    "2023-06-01T10:17:24.185Z",
    "2023-05-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2023-07-11T23:36:17.929Z",
    "2023-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Lucifier Bhatiya",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2023-11-01T13:15:33.035Z",
    "2023-11-30T09:48:16.867Z",
    "2023-12-25T06:04:23.907Z",
    "2023-01-25T14:18:46.235Z",
    "2023-02-05T16:33:06.386Z",
    "2023-04-10T14:43:26.374Z",
    "2023-06-25T18:49:59.371Z",
    "2023-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};
// const account3 = {
//   owner: "Steven Thomas Williams",
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: "Sarah Smith",
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return "This Week";
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth()}`.padStart(2, 0);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date);
    const html = `
   <div class="movements">
        <div class="movements__row">
          <div class="movements_type movements_type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div> 
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div> 
   `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

console.log(containerMovements.innerHTML);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);
console.log(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  //Display Balance
  calcDisplayBalance(acc);
  //Display Summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In Each Call, print the remainig time to UI
    labelTimer.textContent = `${min} : ${sec}`;

    //When 0 Seconds stop timer and logOut user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log In to get started`;
      containerApp.style.opacity = 0;
    }

    //Decrese 1 second
    time--;
  };
  //Set time to 5 minutes
  let time = 300;
  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent =`${income}€`;

  const outGoingMoney = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outGoingMoney)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * 1.2) / 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// const firstWithdrawal = account1.movements.find((mov) => mov > 0);
// //Find method only gives first element of the array which satisfy the condition
// console.log(account1.movements);
// console.log(firstWithdrawal);

//EVENT HANDLER

//LOGIN FEATURE

let currentAccount, timer;
//FAKED TO BE LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//Expermenting With API

const now = new Date();
const options = {
  hour: "numeric",
  minute: "numeric",
  month: "long",
};
labelDate.textContent = new Intl.DateTimeFormat("ar-SY", options).format(now);

const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth()}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const minute = now.getMinutes();

labelDate.textContent = `${day}/${month}/${year}` , `${hour}:${minute}`;
btnLogin.addEventListener("click", function (e) {
  //prevent form from submitting and age
  e.preventDefault();

  // console.log("Login");
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome Back ,${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear Input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    updateUI(currentAccount);
  }
});
//LOAN FEATURE

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amt = Math.floor(inputLoanAmount.value);
  if (amt > 0 && currentAccount.movements.some((mov) => mov * 0.1)) {
    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(amt);
      //Add Dates

      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);

      //Reset Timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
    inputLoanAmount.value = "";
  }
});

//TRANSFER FEATURE

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  console.log(amount, receiverAcc);

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing The Transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //update UI
    updateUI(currentAccount);

    //Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

//CLOSING ACCOUNT FEATURE

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);

    //Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, true);
});

// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// //.entries() method which return an array of arrays method
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(Movement ${i + 1} : You Deposited ${movement} money);
//   }
//   if (movement < 0) {
//     console.log(
//       Movement ${i + 1} : You Deposited ${Math.abs(movement)} money
//     );
//   }
// }

// console.log(----FOR EACH-----);

// movements.forEach(function (movement, i, array) {
//   if (movement > 0) {
//     console.log(Movement ${i + 1} : You Deposited ${movement} money);
//   }
//   if (movement < 0) {
//     console.log(
//       Movement ${i + 1} : You Deposited ${Math.abs(movement)} money
//     );
//   }
// });

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(${key}: ${value});
// });

// const currenciesUnique = new Set([
//   "USD",
//   "EURO",
//   "RS",
//   "EURO",
//   "EURO",
//   "USD",
//   "RS",
//   "USD",
//   "RS",
// ]);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, key, set) {
//   console.log(${key}:${value});
// });
// const balance = account1.movements.reduce(function (acc, curr, i, arr) {
//   console.log(Iteration ${i}:${acc});
//   return acc + curr;
// }, 0);
// console.log("Balance: ", balance);
// const eurToUsd = 1.1;

// const usDepositMoney = account1.movements
//   .filter((mov) => mov > 0)
//   .map((mov) => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log("US deposit:", usDepositMoney, "$");

// const arr = [[1, 2, 3], [4, 5, 6, 7], 8, 9, [10, 11, 12, 13]];
// console.log(arr.flat());

// const arrDeep = [[1, 2, [3, 4]], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

const overallBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

console.log(account1.movements);
account1.movements.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1;
});
console.log(account1.movements);
const arr = [1, 2, 3, 4, 5, 6, 7, 8];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));
const x = new Array(7);
console.log(x);
//Nothing happens in this below method too
//console.log(x.map(() => 5));
x.fill(1, 3);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

//Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const movementsUI = Array.from(document.querySelectorAll(".movements_value"));
console.log(movementsUI);

//2.To check deposit above 10000 in whole accounts array
//Method 1
// const numDeposits1000 = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((mov) => mov >= 1000).length;

//Method 2
const numDeposits1000 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);

//3.To create an object of both sum of deposits and withdrawal
const { deposits, withdrawals } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      return sums; // Don't forget to return the updated object
    },
    { deposits: 0, withdrawals: 0 } // Corrected spelling
  );
console.log(deposits, withdrawals);
//4.Conversion Of Any String To Partially Captialized Strings
//this is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  const exceptions = [
    "a",
    "an",
    "the",
    "but",
    "or",
    "with",
    "on",
    "in",
    "and",
    "is",
  ];
  const titleCase = title
    .toLowerCase()
    .split(" ")
    .map((word) =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");
  return titleCase;
};
// console.log(convertTitleCase(`this is a very nice tutorial`));
// console.log(convertTitleCase(`this is a VERY NIce TUOTORial)`) );
// console.log(convertTitleCase(`here is ANOTHER example for title`));

//Part 12
// console.log(0.1 + 0.2 === 0.3);
// console.log(Number("23"));
// console.log(+"23");

// //Parsing
// console.log(Number.parseInt("30px", 10));
// console.log(Number.parseInt("e23", 10));

// console.log(Number.parseFloat("    2.5rem    "));
// console.log(Number.isNaN(20));
// console.log(Number.isNaN(+"20X"));
// console.log(Number.isNaN(20 / 0));

// //But The Better Method is isFinite Method
// console.log(Number.isFinite(20));
// console.log(Number.isFinite(+"20X"));
// console.log(Number.isFinite(20 / 0));

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));
// console.log(Math.PI * Number.parseFloat("10px") ** 2);

// //To Find A Specific NUmber between A given range of Numbers
// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(10, 20));

// console.log(Math.trunc(23.8));

// console.log(Math.round(23.3));
// console.log(Math.round(23.8));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.8));

// console.log(Math.floor(23.3));
// console.log(Math.floor(23.8));
// console.log((2.7).toFixed(3));
// console.log((2.345).toFixed(2));

// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
//     if (i % 2 === 0) row.style.backgroundColor = "orangered";
//   });
// });

// //Numeric Seperator
// //The underscorers willl be ignored in console.log screen
// const diameter = 486_234_000_001;
// console.log(diameter);

// console.log("230_000");

// //Bigint
// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// //This is a safe result after this it will start giving incorrect results
// //By Adding n at last we can finally display the result accurately
// console.log(699694359895698695869478057884057949584039857099n);

// const huge = 36384756753498745394843854389n;
// const num = 23;
// console.log(huge * BigInt(23));
// console.log(huge + "very huge");
// console.log(20n === 20);

// //Create a date
// const now = new Date();
// console.log(now);

// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 10, 15, 15, 23, 5));
// //In JavaScript the month starts as 00-> JAn 01-> Feb 02-> Mar And So On
// //Javascript Also autocorrects the date bhy shifting it to another month
// console.log(new Date(2037, 10, 31));
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(2142237180000));
console.log(Date.now());

future.setFullYear(2040);
console.log(future);

// const pizzaTimer = setInterval(() => console.log(Here Is Your Pizza🍕), 3000);
// console.log(Waiting);
// clearTimeout(pizzaTimer);

setInterval(function () {
  const now = new Date();
  console.log(now);
}, 1000);