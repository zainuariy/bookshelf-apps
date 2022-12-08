const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const MOVED_EVENT = 'moved-book';
const DELETED_EVENT = 'deleted-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {
    if (isStorageExist()) {
        loadDataFromStorage();
    }
      
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
      event.preventDefault();
      addBook();
    });

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      searchBook();
    });
  });

  function addBook() {
    const id = generateId();
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
   
    let bookStatus;
    if (isComplete.checked) {
        bookStatus = true;
      } else {
        bookStatus = false;
      }

    const bookObject = generateBookObject(id, title, author, year, isComplete);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }
   
  function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
}

  document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
  });

function searchBook() {
    const searchInput = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookItems = document.getElementsByClassName('book_item');
  
    for (let i = 0; i < bookItems.length; i++) {
      const itemTitle = bookItems[i].querySelector('.book-title');
      if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
        bookItems[i].classList.remove('hidden');
      } else {
        bookItems[i].classList.add('hidden');
      }
    }
    }
  

  function makeBookList(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.classList.add('book-title');
    textTitle.innerText = bookObject.title;
   
    const textAuthor = document.createElement('em');
    textTitle.classList.add('book-author');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textTitle.classList.add('book-year');
    textYear.innerText = 'Tahun: ' + bookObject.year;
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthor, textYear);
   
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    const container = document.createElement('div');
    container.classList.add('book_item');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);
   
    if (bookObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = `Belum Selesai Baca`;
    
        undoButton.addEventListener('click', function() {
          returnBookFromCompleted(bookObject.id);
        });
    
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = `Hapus Buku`;
    
        deleteButton.addEventListener('click', function() {
          deleteBook(bookObject.id);
        });
    
        actionContainer.append(undoButton, deleteButton);
        container.append(actionContainer);
      } else {
        const finishButton = document.createElement('button');
        finishButton.classList.add('green');
        finishButton.innerText = `Selesai Baca`;
    
        finishButton.addEventListener('click', function() {
          addBookToCompleted(bookObject.id);
        });
    
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = `Hapus Buku`;
    
        deleteButton.addEventListener('click', function() {
          deleteBook(bookObject.id);
        });
    
        actionContainer.append(finishButton, deleteButton);
        container.append(actionContainer);
      }
    
      return container;
  }

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
  };
  
function returnBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
  };
  
function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);
  
    if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    deleteData();
  };
  
function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
  
    return null;
  };
  
function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
  
    return -1;
  };

  document.addEventListener(RENDER_EVENT, function () {
    const unreadBookList = document.getElementById('incompleteBookshelfList');
    unreadBookList.innerHTML = '';
   
    const readedBookList = document.getElementById('completeBookshelfList');
    readedBookList.innerHTML = '';

    for (const bookItem of books) {
      const bookElement = makeBookList(bookItem);
      if(!bookItem.isComplete) {
      unreadBookList.append(bookElement);
    } else {
        readedBookList.append(bookElement);
    }
    
    } 

  });

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  const moveData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(MOVED_EVENT));
    }
  };
  
  const deleteData = () => {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(DELETED_EVENT));
    }
  };

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  const loadDataFromStorage = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  
    if (data !== null) {
      for (const item of data) {
        books.push(item);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  };

  document.addEventListener(SAVED_EVENT, () => {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert");
    elementCustomAlert.innerText = "Data Berhasil Disimpan!";
  
    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(() => {
      elementCustomAlert.remove();
    }, 2000);
  });
  
  document.addEventListener(MOVED_EVENT, () => {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert");
    elementCustomAlert.innerText = "Berhasil Dipindahkan!";
  
    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(() => {
      elementCustomAlert.remove();
    }, 2000);
  });
  
  document.addEventListener(DELETED_EVENT, () => {
    const elementCustomAlert = document.createElement("div");
    elementCustomAlert.classList.add("alert");
    elementCustomAlert.innerText = "Berhasil Dihapus!";
  
    document.body.insertBefore(elementCustomAlert, document.body.children[0]);
    setTimeout(() => {
      elementCustomAlert.remove();
    }, 2000);
  });