let firebase;
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrsTbvX5eT8jFbaRjiZP0Y4mKpIT5V_J8",
  authDomain: "picadu-acd68.firebaseapp.com",
  databaseURL: "https://picadu-acd68.firebaseio.com",
  projectId: "picadu-acd68",
  storageBucket: "picadu-acd68.appspot.com",
  messagingSenderId: "950307264147",
  appId: "1:950307264147:web:e84e8fddcda5e2cb519f66"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log('firebase: ', firebase);

// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');

const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;
const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');
const userElem = document.querySelector('.user');
const userNameElem = document.querySelector('.user-name');
const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');
const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');
const postsWrapper = document.querySelector('.posts');
const buttonNewPost = document.querySelector('.button-new-post');
const addPostElem = document.querySelector('.add-post');
const DEFAULT_PHOTO = userAvatarElem.src;
const loginForget = document.querySelector('.login-forget');

const setUsers = {
  user: null,
  initUser(handler) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
      if (handler) {
        handler();
      }
    });
  },
  logIn(email, password) {
    if (!regExpValidEmail.test(email)) {
      alert('Некорректный e-mail');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(err => {
        const errCode = err.code;
        const errMessage = err.message;

        if (errCode === 'auth/wrong-password') {
          console.log(errMessage);
          alert('Неверный пароль');
        } else if (errCode === 'auth/user-not-found') {
          console.log(errMessage);
          alert('Пользователь с таким e-mail не найден');
        } else {
          console.log(errMessage);
        }
        console.log(err);
      }
      );
    // const user = this.getUser(email);
    // if (user && user.password === password) {
    //   this.authorizedUser(user);
    //   if (handler) {
    //     handler();
    //   }
    // } else {
    //   alert('Пользователь с такими данными не найден');
    // }
  },
  logOut() {
    firebase.auth().signOut();
    // if (handler) {
    //   handler();
    // }
  },
  signUp(email, password, handler) {
    if (!regExpValidEmail.test(email)) {
      alert('Некорректный e-mail');
      return;
    }
    if (!email.trim() || !password.trim()) {
      alert('Введите данные');
      return;
    }

    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        this.editUser(email.substring(0, email.indexOf('@')), null, handler);
      })
      .catch(err => {
        const errCode = err.code;
        const errMessage = err.message;

        if (errCode === 'auth/weak-password') {
          console.log(errMessage);
          alert('Слабый пароль');
        } else if (errCode === 'auth/email-already-in-use') {
          console.log(errMessage);
          alert('Пользователь с таким e-mail уже зарегистрирован');
        } else {
          console.log(errMessage);
        }
        console.log(err);
      });
    // if (!this.getUser(email)) {
    //   const user = {email, password, displayName: email.substring(0, email.indexOf('@'))};
    //   listUsers.push(user);
    //   this.authorizedUser(user);
    //   if (handler) {
    //     handler();
    //   }
    //   console.log(listUsers);
    // } else {
    //   alert('Пользователь с таким e-mail уже зарегистрирован');
    // }
  },
  editUser(displayName, photoURL, handler) {
    const user = firebase.auth().currentUser;

    if (displayName) {
      if (photoURL) {
        user.updateProfile({
          displayName, 
          photoURL
        }).then(handler);
      } else {
          user.updateProfile({
          displayName
          }).then(handler);
        }
    }
  },
  // getUser(email) {
  //   return listUsers.find(item => item.email === email);
  // },
  // authorizedUser(user) {
  //   this.user = user;
  // }
  sendForget(email) {
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      alert('Письмо отправлено');
    })
    .catch(err => {
      console.log(err);
    });
  }
};

loginForget.addEventListener('click', e => {
  event.preventDefault();
  setUsers.sendForget(emailInput.value);
  emailInput.value = '';
});

const setPosts = {
  allPosts: [],
  addPost(title, text, tags, handler) {
    const user = firebase.auth().currentUser;
    
    this.allPosts.unshift({
      id: `postID${(+new Date()).toString(16)}-${user.uid}`,
      title, 
      text, 
      tags: tags.split(',').map(item => item.trim()), 
      author: {
        displayName: setUsers.user.displayName,
        photo: setUsers.user.photoURL
      }, 
      date: new Date().toLocaleString(), 
      likes: 0, 
      comments: 0
    });
    
    firebase.database().ref('post').set(this.allPosts)
    .then(() => this.getPosts(handler));
  },
  getPosts(handler) {
    firebase.database().ref('post').on('value', snapshot => {
      this.allPosts = snapshot.val() || [];
      handler();
    });
  }
};

const showAllPosts = () => {
  let postsHTML = '';
  setPosts.allPosts.forEach(({title, text, tags, date, author, likes, comments}) => {
    postsHTML += `
      <section class="post">
        <div class="post-body">
          <h2 class="post-title">${title}</h2>
          <p class="post-text">${text}</p>
          <div class="tags">
            ${tags.map(tag => `<a href="#" class="tag">#${tag}</a>`)}            
          </div>
        </div>
        <div class="post-footer">
          <div class="post-buttons">
            <button class="post-button likes">
              <svg width="19" height="20" class="icon icon-like">
                <use xlink:href="img/icons.svg#like"></use>
              </svg>
              <span class="likes-counter">${likes}</span>
            </button>
            <button class="post-button comments">
              <svg width="21" height="21" class="icon icon-comment">
                <use xlink:href="img/icons.svg#comment"></use>
              </svg>
              <span class="comments-counter">${comments}</span>
            </button>
            <button class="post-button save">
              <svg width="19" height="19" class="icon icon-save">
                <use xlink:href="img/icons.svg#save"></use>
              </svg>
            </button>
            <button class="post-button share">
              <svg width="17" height="19" class="icon icon-share">
                <use xlink:href="img/icons.svg#share"></use>
              </svg>
            </button>
          </div>
          <div class="post-author">
            <div class="author-about">
              <a href="#" class="author-username">${author.displayName}</a>
              <span class="post-time">${date}</span>
            </div>
            <a href="#" class="author-link">
              <img src=${author.photo || 'https://whatsism.com/uploads/posts/2018-05/thumbs/1525373578_va_pikachu.jpg'} 
                  alt="avatar" 
                  class="author-avatar">
            </a>
          </div>
        </div>
      </section>
      `;
  });
  postsWrapper.innerHTML = postsHTML;
  addPostElem.classList.remove('visible');
  postsWrapper.classList.add('visible');
};

const toggleAuthDom = () => {
  const user = setUsers.user;
  console.log('user: ', user);

  if (user) {
    loginElem.style.display = 'none';
    userElem.style.display = '';
    userNameElem.textContent = user.displayName;
    userAvatarElem.src = user.photoURL || DEFAULT_PHOTO;
    buttonNewPost.classList.add('visible');
  } else {
    loginElem.style.display = '';
    userElem.style.display = 'none';
    buttonNewPost.classList.remove('visible');
    addPostElem.classList.remove('visible');
    postsWrapper.classList.add('visible');
  }
};

const showAddPosts = () => {
  addPostElem.classList.add('visible');
  postsWrapper.classList.remove('visible');
};

const init = () => {
  // отслеживаем клик по кнопке меню и запускаем функцию 
  menuToggle.addEventListener('click', function (event) {
  // отменяем стандартное поведение ссылки
    event.preventDefault();
  // вешаем класс на меню, когда кликнули по кнопке меню 
    menu.classList.toggle('visible');
  });
  
  loginForm.addEventListener('submit', e => {
    event.preventDefault();
    setUsers.logIn(emailInput.value, passInput.value, toggleAuthDom);
    loginForm.reset();
  });
  loginSignup.addEventListener('click', e => {
    event.preventDefault();
    setUsers.signUp(emailInput.value, passInput.value, toggleAuthDom);
    loginForm.reset();
  });
  exitElem.addEventListener('click', e => {
    event.preventDefault();
    setUsers.logOut();
  });
  editElem.addEventListener('click', e => {
    event.preventDefault();
    editContainer.classList.toggle('visible');
    editUsername.value = setUsers.user.displayName;
  });
  editContainer.addEventListener('submit', e => {
    event.preventDefault();
    setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom);
    editContainer.classList.remove('visible');
  });
  buttonNewPost.addEventListener('click', e => {
    event.preventDefault();
    showAddPosts();
  });
  addPostElem.addEventListener('submit', e => {
    event.preventDefault();
    const { title, text, tags } = addPostElem.elements;
    if (title.value.length < 6) {
      alert('Слишком короткий заголовок');
      return;
    }
    if (text.value.length < 50) {
      alert('Слишком короткий пост');
      return;
    }
    setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
    addPostElem.classList.remove('visible');
    addPostElem.reset();
  });

  setUsers.initUser(toggleAuthDom);
  setPosts.getPosts(showAllPosts);
};

document.addEventListener('DOMContentLoaded', init);






