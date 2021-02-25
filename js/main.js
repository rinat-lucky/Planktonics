// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');

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

const setPosts = {
  allPosts: [],
  addPost(title, text, tags) {
    
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
      </div>
      `;
  });
  postsWrapper.innerHTML = postsHTML;
};

const init = () => {
  
  addPostElem.addEventListener('submit', e => {
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

  // setPosts.getPosts(showAllPosts);
};

document.addEventListener('DOMContentLoaded', init);



// Tabs
    
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