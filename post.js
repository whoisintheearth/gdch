const data = window.GDCHData;
const user = data.getSessionUser();
const params = new URLSearchParams(window.location.search);
const postId = Number(params.get("id"));
const detail = document.querySelector("#postDetail");
const identityTitle = document.querySelector("#identityTitle");
const identityText = document.querySelector("#identityText");
const detailTitle = document.querySelector("#detailTitle");
const profileAvatar = document.querySelector("#profileAvatar");
const profileName = document.querySelector("#profileName");
const profileGroup = document.querySelector("#profileGroup");
let easterEggTimer = null;
const EASTER_EGG_SEEN_KEY = 'gdch-easter-egg-seen';

if (!user) {
  window.location.href = "index.html";
  throw new Error("Login required");
}

if (user.company === "공무원" || user.company === "공무원(재난관리국)") {
  user.company = "초자연 재난관리국";
}

function getPost() {
  return data.getPosts().find((post) => post.id === postId);
}

function savePost(updater) {
  const posts = data.getPosts();
  const post = posts.find((item) => item.id === postId);
  if (!post) return null;
  updater(post);
  data.savePosts(posts);
  return post;
}

function getCompanyAvatar(company) {
  if (company === "초자연 재난관리국") return '<img class="avatar-image" src="assets/avatar-disaster.svg" alt="초자연 재난관리국">';
  if (company === "일반 회사") return '<img class="avatar-image" src="assets/avatar-general.svg" alt="일반 회사">';
  return '<img class="avatar-image" src="assets/avatar-daydream.svg" alt="백일몽">';
}

function renderComment(comment) {
  return `
    <div class="comment-item">
      <div class="comment-avatar">익</div>
      <div>
        <strong>${comment.author}</strong>
        <p>${comment.body}</p>
        <span>${comment.time}</span>
      </div>
    </div>
  `;
}

function renderBlocked(message) {
  detailTitle.textContent = "GDCH 게시글";
  detail.innerHTML = `
    <section class="post detail-view">
      <a class="ghost-button link-button back-button" href="index.html">목록으로</a>
      <h2>${message}</h2>
      <p class="detail-body">목록으로 돌아가 다른 글을 확인해 주세요.</p>
    </section>
  `;
}

function clearEasterEggTimer() {
  if (!easterEggTimer) return;
  clearTimeout(easterEggTimer);
  easterEggTimer = null;
}

function triggerEasterEgg() {
  if (document.querySelector(".easter-egg-overlay")) return;
  localStorage.setItem(EASTER_EGG_SEEN_KEY, "true");

  const overlay = document.createElement("div");
  overlay.className = "easter-egg-overlay";
  const stream = document.createElement("div");
  stream.className = "easter-egg-stream";
  stream.innerHTML = Array.from({ length: 18 }, (_, rowIndex) => `<div class="easter-egg-line" style="--line-index: ${rowIndex}">${Array.from({ length: 10 }, () => '<span>이름님을 찬양하라</span>').join("")}</div>`).join("");
  overlay.appendChild(stream);
  document.body.appendChild(overlay);

  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
}

function scheduleEasterEgg(post) {
  clearEasterEggTimer();
  if (!post || !post.easterEgg) return;
  if (localStorage.getItem(EASTER_EGG_SEEN_KEY) === "true") return;

  const randomDelay = Math.floor(4000 + Math.random() * 8000);
  easterEggTimer = setTimeout(triggerEasterEgg, randomDelay);
}
function getInitial(name) {
  return (name || "나").trim().slice(0, 1);
}

function renderProfile() {
  profileAvatar.innerHTML = getCompanyAvatar(user.company);
  profileName.textContent = user.name;
  profileGroup.textContent = user.company;
}

function render() {
  renderProfile();
  const post = getPost();

  identityTitle.textContent = user.company;
  identityText.textContent = `${user.name}님은 ${user.company} 소속으로 가입했습니다.`;

  if (!post) {
    clearEasterEggTimer();
    renderBlocked("글을 찾을 수 없습니다.");
    return;
  }

  scheduleEasterEgg(post);

  document.querySelector("#detailLikes").textContent = String(post.likes);
  document.querySelector("#detailComments").textContent = String(post.comments.length);
  document.querySelector("#detailGroup").textContent = post.company;

  detail.innerHTML = `
    <article class="post detail-view">
      <div class="post-header detail-header">
        <div class="author">
          <span class="avatar">${getCompanyAvatar(post.company)}</span>
          <div>
            <strong>${post.author}</strong>
            <span>${post.company} · ${post.time}</span>
          </div>
        </div>
        <span class="badge">${data.typeLabels[post.type]}</span>
      </div>
      <h2>${post.title}</h2>
      <p class="detail-body">${post.body}</p>
      <div class="post-footer">
        <div class="action-row">
          <button class="action-button ${post.liked ? "active" : ""}" type="button" id="likeButton">좋아요 ${post.likes}</button>
          <button class="action-button ${post.saved ? "active" : ""}" type="button" id="saveButton">${post.saved ? "저장됨" : "저장"}</button>
        </div>
        <span class="post-meta">${post.company} 소속 글</span>
      </div>
    </article>
    <section class="comments-panel" aria-label="댓글">
      <div class="comments-head">
        <h2>댓글 ${post.comments.length}</h2>
        <span>GDCH 가입 멤버 댓글</span>
      </div>
      <div class="comment-list">
        ${post.comments.length ? post.comments.map(renderComment).join("") : '<p class="empty-state">아직 댓글이 없습니다.</p>'}
      </div>
      <form class="comment-form" id="commentForm">
        <label>
          <span>댓글 쓰기</span>
          <textarea id="commentInput" rows="3" maxlength="160" placeholder="익명 댓글을 입력하세요"></textarea>
        </label>
        <button class="primary-button" type="submit">댓글 등록</button>
      </form>
    </section>
  `;
}

detail.addEventListener("click", (event) => {
  if (event.target.id === "likeButton") {
    savePost((post) => {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
    });
    render();
  }

  if (event.target.id === "saveButton") {
    savePost((post) => {
      post.saved = !post.saved;
    });
    render();
  }
});

detail.addEventListener("submit", (event) => {
  if (event.target.id !== "commentForm") return;
  event.preventDefault();
  const input = document.querySelector("#commentInput");
  const body = input.value.trim();

  if (!body) {
    input.focus();
    return;
  }

  savePost((post) => {
    post.comments.push({
      author: `${user.name} 익명`,
      body,
      time: "방금 전",
    });
  });
  render();
});

document.querySelector("#logoutButton").addEventListener("click", () => {
  data.clearSession();
  window.location.href = "index.html";
});

render();



















