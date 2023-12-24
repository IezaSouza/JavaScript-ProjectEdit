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

fetchUsers().then((users) => {
  console.log("Dados dos usuários:", users);
});

fetchPosts().then((posts) => {
  console.log("Dados dos posts:", posts);
  createPost(posts);
});

async function createPost(posts) {
  const areaPosts = document.getElementById("areaPosts");

  const users = await fetchUsers(); // Obtendo os dados dos usuários

  for (const post of posts) {
    const newArticle = document.createElement("article");
    const newTitle = document.createElement("h3");
    const newPostBody = document.createElement("p");
    const createdDate = document.createElement("footer");
    const likeCount = document.createElement("footer");

    newArticle.classList.add("post");

    newTitle.textContent = post.title;
    newPostBody.textContent = post.body;

    const postDate = new Date(post.createdAt);
    createdDate.textContent = `Created at: ${postDate.toLocaleString()}`;
    likeCount.textContent = `Likes: ${post.likes.length}`;

    const commentsSection = document.createElement("div");
    commentsSection.classList.add("comments");

    for (const comment of post.comments) {
      const commentDiv = document.createElement("div");
      const commentBody = document.createElement("p");
      const commentDate = document.createElement("span");

      const user = users.find((user) => user.id === comment.userId); // Encontrando o usuário pelo ID

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
