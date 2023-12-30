import "./style.css";

const usersEndpoint =
  "https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/users.json";

const postsEndpoint =
  "https://jmrfrosa.github.io/edit-jsts-dec2023.github.io/data/posts.json";

type User = {
  id: number;
  name: string;
  picture: string;
};

type Post = {
  title: string;
  body: string;
  createdAt: string;
  likes: number[];
  comments: {
    userId: number;
    body: string;
    createdAt: string;
  };
};

async function fetchUsers() {
  const response = await fetch(usersEndpoint);
  const users = await response.json();
  return users;
}

async function fetchPosts() {
  const response = await fetch(postsEndpoint);
  const posts = await response.json();
  return posts;
}

let allPosts = [];

fetchUsers().then((users) => {
  console.log("Dados dos usuários:", users);
});

fetchPosts().then((posts) => {
  allPosts = posts;
  createPost(allPosts);
});

async function createPost(posts) {
  const areaPosts = document.getElementById("areaPosts");

  const users = await fetchUsers();

  for (const post of posts) {
    const newArticle = document.createElement("article");
    const newTitle = document.createElement("h3");
    const newPostBody = document.createElement("p");

    newArticle.classList.add("post");

    newTitle.textContent = post.title;
    newPostBody.textContent = post.body;

    const createdDate = document.createElement("p");
    const likeCount = document.createElement("p");

    const postDate = new Date(post.createdAt);
    createdDate.textContent = `Created at: ${postDate.toLocaleString()}`;
    likeCount.textContent = `Likes: ${post.likes.length}`;

    const commentsSection = document.createElement("div");
    commentsSection.classList.add("comments");

    for (const comment of post.comments) {
      const commentDiv = document.createElement("div");
      const commentBody = document.createElement("p");
      const commentDate = document.createElement("span");

      const user = users.find((user) => user.id === comment.userId);

      if (user) {
        const commentUser = document.createElement("div");
        const commentUserName = document.createElement("p");
        const commentUserPicture = document.createElement("img");

        commentUserName.textContent = user.name;
        commentUserPicture.src = user.picture;

        commentUser.appendChild(commentUserName);
        commentUser.appendChild(commentUserPicture);
        commentDiv.appendChild(commentUser);
      }

      commentBody.textContent = comment.body;
      const commentDateTime = new Date(comment.createdAt);
      commentDate.textContent = `Commented at: ${commentDateTime.toLocaleString()}`;

      commentDiv.appendChild(commentBody);
      commentDiv.appendChild(commentDate);
      commentsSection.appendChild(commentDiv);
    }

    newArticle.appendChild(newTitle);
    newArticle.appendChild(newPostBody);
    newArticle.appendChild(createdDate);
    newArticle.appendChild(likeCount);
    newArticle.appendChild(commentsSection);

    areaPosts.appendChild(newArticle);
  }
}

const searchIpt = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchButton");

searchBtn.addEventListener("click", () => {
  const searchTerm = searchIpt.value;
  searchPostsByTitle(searchTerm);
});

function searchPostsByTitle(searchTerm) {
  const postTitleElement = document.querySelectorAll("h3");
  let found = false;
  let count = 0;

  postTitleElement.forEach((titleElement) => {
    const postTitle = titleElement.textContent?.toLowerCase();
    const postElement = titleElement.parentElement;

    if (postTitle?.includes(searchTerm.toLowerCase())) {
      postElement.style.display = "block";
      found = true;
      count++;
    } else {
      postElement.style.display = "none";
    }
  });

  const noPostsFoundElement = document.getElementById("noPostsFound");
  if (!found) {
    noPostsFoundElement.style.display = "block";
  } else {
    noPostsFoundElement.style.display = "none";
  }

  const searchResultElement = document.getElementById("searchResult");
  if (searchResultElement) {
    searchResultElement.textContent = `${count} post(s) found`;
  }
}
