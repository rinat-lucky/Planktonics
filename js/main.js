// Добавление сообщений в чат

const userNameElem = document.querySelector('.user-name');
const userAvatarElem = document.querySelector('.user-avatar');
const postsWrapper = document.querySelector('.posts');
const addPostElem = document.querySelector('.add-post');

const setPosts = {
	allPosts: [],
	addPost(title, text, tags, handler) {
		
		this.allPosts.unshift({
			title, 
			text, 
			tags: tags.split(',').map(item => item.trim()), 
			author: {
				displayName: userNameElem,
				photo: userAvatarElem
			}, 
			date: new Date().toLocaleString(), 
			likes: 0, 
			comments: 0
		});

		if (handler) {
			handler();
		}
	},
};

const showAllPosts = () => {
	let postsHTML = '';
	setPosts.allPosts.forEach(({title, text, tags, date, author, likes, comments}) => {
		postsHTML += `
		<div class="post">
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
				<a href="#" class="author-username">${userNameElem || 'User'}</a>
				<span class="post-time">${date}</span>
				</div>
				<a href="#" class="author-link">
				<img src=${userAvatarElem || 'https://whatsism.com/uploads/posts/2018-05/thumbs/1525373578_va_pikachu.jpg'} 
					alt="avatar" 
					class="author-avatar">
				</a>
			</div>
			</div>
		</div>
		`;
	});
	postsWrapper.innerHTML = postsHTML; вызвать этот метод у более низкого элемента, чтобы не стирать заголовок + поставить активный класс чата в значении переменной postsWrapper
};

const init = () => {
	addPostElem.addEventListener('submit', () => {
		event.preventDefault();
		const { title, text, tags } = addPostElem.elements;
		if (title.value.length < 6) {
		alert('Слишком короткий заголовок');
		return;
		}
		if (text.value.length < 10) {
		alert('Слишком короткий пост');
		return;
		}
		setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
		addPostElem.reset();
	});
};

document.addEventListener('DOMContentLoaded', init);


// Tabs (переключение между двумя чатами)
    
let tabs = document.querySelectorAll('.sidebar-menu-link');
let tabsContent = document.querySelectorAll('.posts-chat');
let tabsParent = document.querySelector('.sidebar-menu');

function hideTabContent() {
    tabsContent.forEach(item => {
        item.style.display = 'none';
    });

    tabs.forEach(item => {
        item.classList.remove('active');
    });
}

function showTabContent(i = 0) {
    tabsContent[i].style.display = 'block';
    tabs[i].classList.add('active');
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