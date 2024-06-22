"use strict";


const books = [
  { id: 1, title: "The Midnight Library", category: "Fiction", price: 10 },
  { id: 2, title: "1984", category: "Dystopian", price: 15 },
  { id: 3, title: "Animal Farm", category: "Satire", price: 20 },
  { id: 4, title: "White Nights", category: "Classic", price: 12 },
  { id: 5, title: "My Sweet Orange Tree", category: "Children's Literature", price: 18 },
  { id: 6, title: "The Brothers Karamazov", category: "Classic", price: 25 },
  { id: 7, title: "Crime And Punishment", category: "Classic", price: 30 },
];


const users = [
  { username: "ilayda", password: "password1", purchasedBooks: [], balance: 100, receivedMessages: [] },
  { username: "özge", password: "password2", purchasedBooks: [], balance: 150, receivedMessages: [] },
  { username: "behlül", password: "password3", purchasedBooks: [], balance: 200, receivedMessages: [] },
];

let currentUser = null;


const displayBooks = () => {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = "";
  books.forEach(book => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");
    bookElement.innerHTML = `
      <h3>${book.title}</h3>
      <p>$${book.price}</p>
      <button class="buyBtn" data-id="${book.id}">Buy</button>
    `;
    bookList.appendChild(bookElement);
  });
};


const displayOwnedBooks = () => {
  const ownedBookList = document.getElementById("ownedBookList");
  ownedBookList.innerHTML = "";
  currentUser.purchasedBooks.forEach(book => {
    const bookItem = document.createElement("li");
    bookItem.textContent = book.title;
    ownedBookList.appendChild(bookItem);
  });
};


const displayUserBalance = () => {
  document.getElementById("userBalance").textContent = currentUser.balance.toFixed(2);
};


const displayReceivedMessages = () => {
  const receivedMessageList = document.getElementById("receivedMessageList");
  receivedMessageList.innerHTML = "";
  currentUser.receivedMessages.forEach(message => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `
      <p><strong>From:</strong> ${message.sender}</p>
      <p><strong>Book:</strong> ${message.bookTitle}</p>
      <p><strong>Category:</strong> ${message.category}</p>
      <p>${message.content}</p>
    `;
    receivedMessageList.appendChild(messageElement);
  });
};


document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const user = users.find(user => user.username === username && user.password === password);
  if(user) {
    currentUser = user;
    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("bookStoreContainer").classList.remove("hidden");
    document.getElementById("giftContainer").classList.remove("hidden");
    document.getElementById("currentUser").textContent = username;
    displayBooks();
    displayOwnedBooks();
    populateGiftForm();
    displayUserBalance();
    displayReceivedMessages();
  } else {
    alert("Invalid username or password. Please try again.");
  }
});


document.getElementById("logoutBtn").addEventListener("click", function() {
  currentUser = null;
  document.getElementById("loginContainer").classList.remove("hidden");
  document.getElementById("bookStoreContainer").classList.add("hidden");
  document.getElementById("giftContainer").classList.add("hidden");
});


document.getElementById("bookList").addEventListener("click", function(event) {
  if(event.target.classList.contains("buyBtn")) {
    const bookId = parseInt(event.target.getAttribute("data-id"));
    const book = books.find(book => book.id === bookId);
    if(book && currentUser.balance >= book.price) {
      currentUser.purchasedBooks.push(book);
      currentUser.balance -= book.price;
      alert(`You purchased ${book.title} for $${book.price}`);
      displayOwnedBooks();
      populateGiftForm();
      displayUserBalance();
    } else {
      alert("Insufficient balance to purchase this book.");
    }
  }
});


document.getElementById("giftForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const bookId = parseInt(document.getElementById("giftBookSelect").value);
  const recipientUsername = document.getElementById("giftUserSelect").value;
  const message = document.getElementById("giftMessage").value;
  const category = document.getElementById("bookCategorySelect").value;

  const bookIndex = currentUser.purchasedBooks.findIndex(book => book.id === bookId);
  if(bookIndex > -1) {
    const book = currentUser.purchasedBooks.splice(bookIndex, 1)[0];
    const recipient = users.find(user => user.username === recipientUsername);
    if(recipient) {
      recipient.purchasedBooks.push(book);
      recipient.receivedMessages.push({
        sender: currentUser.username,
        bookTitle: book.title,
        category: category,
        content: message
      });
      alert(`You gifted ${book.title} to ${recipientUsername}\nMessage: ${message}\nCategory: ${category}`);
      populateGiftForm();
      displayOwnedBooks();
      return;
    }
  }
  alert("Gift sending failed. Please try again.");
});


const populateGiftForm = () => {
  const giftBookSelect = document.getElementById("giftBookSelect");
  const giftUserSelect = document.getElementById("giftUserSelect");

  giftBookSelect.innerHTML = "";
  giftUserSelect.innerHTML = "";

  currentUser.purchasedBooks.forEach(book => {
    const option = document.createElement("option");
    option.value = book.id;
    option.textContent = book.title;
    giftBookSelect.appendChild(option);
  });

  users.forEach(user => {
    if(user.username !== currentUser.username) {
      const option = document.createElement("option");
      option.value = user.username;
      option.textContent = user.username;
      giftUserSelect.appendChild(option);
    }
  });
};
