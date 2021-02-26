const userNameElem = document.querySelector('.user-name');
const userAvatarElem = document.querySelector('.user-avatar');
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

const showAllPosts = () => {
	const userAvatar = userAvatarElem.src;
	const userName = userNameElem.textContent;
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
	
	const deleteBtns = document.querySelectorAll('.delete');
	deleteBtns.forEach((item) => {
		item.addEventListener('click', () => {
			const post = item.closest('.post');
			post.remove();
		});
	});

	return;
};

const init = () => {
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

document.addEventListener('DOMContentLoaded', init);