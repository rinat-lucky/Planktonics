const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const loginForget = document.querySelector('.login-forget');
const loginSignup = document.querySelector('.login-signup');
const emailInput = document.querySelector('.login-email');
const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;
const userElem = document.querySelector('.user');
const userAvatarElem = document.querySelector('.user-avatar');
const DEFAULT_PHOTO = userAvatarElem.src;
const userNameElem = document.querySelector('.user-name');
const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');
const editUserName = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const postsWrapper = document.querySelectorAll('.post-wrapper');
const addPostElem = document.querySelector('.add-post');
let tabs = document.querySelectorAll('.sidebar-menu-link');
let tabsContent = document.querySelectorAll('.posts-chat');
let tabsParent = document.querySelector('.sidebar-menu');


// Tabs (переключение между двумя чатами)
    
function hideTabContent() {
    tabsContent.forEach(item => {
        item.style.display = 'none';
    });
    tabs.forEach(item => {
        item.classList.remove('active');
    });
	postsWrapper.forEach(item => {
        item.classList.remove('post-wrapper-active');
    });
}

function showTabContent(i = 0) {
    tabsContent[i].style.display = 'block';
    tabs[i].classList.add('active');
	postsWrapper[i].classList.add('post-wrapper-active');
}

hideTabContent();
showTabContent();

tabsParent.addEventListener('click', function(event) {
  	const target = event.target;
  	if(target && target.classList.contains('sidebar-menu-link')) {
		tabs.forEach((item, i) => {
			if (target == item) {
				hideTabContent();
				showTabContent(i);
			}
		});
	}
});

// Добавление сообщений в чат (и удаление авторских сообщений)

const setUsers = {
	user: {
		name: '',
		photo: ''
	},
	logIn(email) {
		if (!regExpValidEmail.test(email)) {
		  	alert('Некорректный e-mail');
		  	return;
		} else {
			setUsers.user.name = email.substring(0, email.indexOf('@'));
			toggleAuthDom();
		}
	},
	logOut() {
		setUsers.user = undefined;
		toggleAuthDom();
	},
	editUser(nameEdit, photoEdit) {
		if (nameEdit) {
			setUsers.user.name = nameEdit;
		}
		if (photoEdit) {
			setUsers.user.photo = photoEdit;
		}		
		toggleAuthDom();
	},
};

const setPosts = {
	allPosts: [],
	addPost(title, text, handler) {
		this.allPosts.unshift({
			title, 
			text, 
			date: new Date().toLocaleString(), 
			likes: 0
		});
		if (handler) {
			handler();
		}
	},
};

const showAllPosts = function () {
	const userAvatar = setUsers.user.photo;
	const userName = setUsers.user.name;
	const title = addPostElem.elements.title.value;
	const text = addPostElem.elements.text.value;
	const date = new Date().toLocaleString();
	let likes = 0;
	let postsHTML = '';	
		postsHTML += `
			<div class="post">	
				<div class="post-body">
					<h2 class="post-title">${title}</h2>
					<p class="post-text">${text}</p>
				</div>
				<div class="post-footer">
					<div class="post-buttons">
						<button class="post-button likes">
							<svg width="19" height="20" class="icon icon-like">
								<use xlink:href="img/icons.svg#like"></use>
							</svg>
							<span class="likes-counter">${likes}</span>
						</button>
						<button class="post-button delete">
							<img src="img/delete.svg" alt="delete" width="19" height="20" class='icon'>
						</button>
					</div>
					<div class="post-author">
						<div class="author-about">
							<a href="#" class="author-username">${userName}</a>
							<span class="post-time">${date}</span>
						</div>
						<a href="#" class="author-link">
							<img src=${userAvatar} alt="avatar" class="author-avatar">
						</a>
					</div>
				</div>
			</div>
		`;
	document.querySelector('.post-wrapper-active').insertAdjacentHTML("beforeend", postsHTML);

	const serializedPosts = JSON.stringify(setPosts.allPosts);
	localStorage.setItem('all posts', serializedPosts);

	// const serializedPosts = document.querySelectorAll('.post');
	// serializedPosts.forEach(function(item, i) { 
	// 	const serializedPostAuthor = JSON.stringify(`${item[i].userName}`);
	// 	const serializedPostContent = JSON.stringify(`${item[i].title}: ${item[i].text}`);
	// 	localStorage.setItem(serializedPostAuthor, serializedPostContent);
	// });


	// area.value = localStorage.getItem('area');
    // area.oninput = () => {
    //   localStorage.setItem('area', area.value)
    // };



	const deleteBtns = document.querySelectorAll('.delete');
	deleteBtns.forEach((item) => {
		item.addEventListener('click', () => {
			const post = item.closest('.post');
			post.remove();
		});
	});
	return;
};

const toggleAuthDom = () => {
	const user = setUsers.user;
	if (user) {
	  	loginElem.style.display = 'none';
	  	userElem.style.display = 'block';
	  	userNameElem.textContent = user.name;
	  	userAvatarElem.src = user.photo || DEFAULT_PHOTO;
		addPostElem.classList.add('visible');
		// localStorage.setItem('users', serializedUsers);
	} else {
	  	loginElem.style.display = '';
	  	userElem.style.display = 'none';
	  	addPostElem.classList.remove('visible');
	}
};

const init = () => {
	loginForm.addEventListener('submit',() => {
		event.preventDefault();
		setUsers.logIn(emailInput.value);
		loginForm.reset();
	});
	loginSignup.addEventListener('click', () => {
		event.preventDefault();
		loginForm.reset();
		alert('Здесь должен запускаться скрипт регистрации пользователя');
	});
	exitElem.addEventListener('click', () => {
		event.preventDefault();
		setUsers.logOut();
	});
	editElem.addEventListener('click', () => {
		event.preventDefault();
		editContainer.classList.toggle('visible');
	});
	editContainer.addEventListener('submit', () => {
		event.preventDefault();
		editContainer.classList.remove('visible');
		setUsers.editUser(editUserName.value, editPhotoURL.value);
	});
	addPostElem.addEventListener('submit', () => {
		event.preventDefault();
		const { title, text } = addPostElem.elements;

		if (title.value.length < 2) {
			alert('Слишком короткий заголовок сообщения');
			return;
		}
		if (text.value.length < 3) {
			alert('Слишком короткое сообщение');
			return;
		}

		setPosts.addPost(title.value, text.value, showAllPosts);
		addPostElem.reset();
	});
};

loginForget.addEventListener('click', () => {
	event.preventDefault();
	alert('Здесь должен запускаться скрипт восстановления пароля через e-mail');
});

document.addEventListener('DOMContentLoaded', init);