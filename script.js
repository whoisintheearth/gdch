const data = window.GDCHData;

const state = {
  user: null,
  company: "(주) 백일몽 주식회사",
  filter: "all",
  view: "home",
  query: "",
};

const authScreen = document.querySelector("#authScreen");
const appShell = document.querySelector("#appShell");
const signupForm = document.querySelector("#signupForm");
const loginForm = document.querySelector("#loginForm");
const signupMessage = document.querySelector("#signupMessage");
const loginMessage = document.querySelector("#loginMessage");
const feed = document.querySelector("#feed");
const chips = document.querySelector("#chips");
const identityTitle = document.querySelector("#identityTitle");
const identityText = document.querySelector("#identityText");
const profileAvatar = document.querySelector("#profileAvatar");
const profileName = document.querySelector("#profileName");
const profileGroup = document.querySelector("#profileGroup");
const composer = document.querySelector("#composer");
const postType = document.querySelector("#postType");
const postTitle = document.querySelector("#postTitle");
const postBody = document.querySelector("#postBody");
const searchInput = document.querySelector("#searchInput");

function normalizeCompany(company) {
  if (company === "공무원" || company === "공무원(재난관리국)") return "초자연 재난관리국";
  return company;
}

function setSession(user) {
  user.company = normalizeCompany(user.company);
  state.user = user;
  state.company = user.company;
  state.view = "home";
  state.filter = "all";
  data.setSession(user);
}

function showAuthTab(tab) {
  document.querySelectorAll(".auth-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.authTab === tab);
  });
  signupForm.classList.toggle("hidden", tab !== "signup");
  loginForm.classList.toggle("hidden", tab !== "login");
  signupMessage.textContent = "";
  loginMessage.textContent = "";
}

function showApp() {
  authScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  render();
}

function showAuth() {
  appShell.classList.add("hidden");
  authScreen.classList.remove("hidden");
  state.user = null;
  data.clearSession();
}

function getCommunityPosts() {
  return data.getPosts();
}

function getVisiblePosts() {
  return getCommunityPosts()
    .filter((post) => {
      if (state.view === "hot") return post.likes >= 30;
      if (state.view === "saved") return post.saved;
      if (state.view === "company") return post.company === state.company;
      return true;
    })
    .filter((post) => {
      if (state.filter === "mine") return post.company === state.company;
      if (state.filter === "question") return post.type === "question";
      if (state.filter === "vent") return post.type === "vent";
      return true;
    })
    .filter((post) => {
      const text = `${post.title} ${post.body} ${post.company}`.toLowerCase();
      return text.includes(state.query.toLowerCase());
    });
}

function getCommentCount(post) {
  return post.comments.length;
}

function getInitial(name) {
  return (name || "나").trim().slice(0, 1);
}

function renderProfile() {
  profileAvatar.innerHTML = getCompanyAvatar(state.company);
  profileName.textContent = state.user.name;
  profileGroup.textContent = state.company;
}

function getAffiliationText(company) {
  if (company === "초자연 재난관리국") return "초자연 재난관리국 소속으로 가입되어 있습니다.";
  if (company === "일반 회사") return "일반 회사 직장인으로 가입되어 있습니다.";
  return "백일몽 소속으로 가입되어 있습니다.";
}

function renderIdentity() {
  identityTitle.textContent = state.company;
  identityText.textContent = getAffiliationText(state.company);
}

function getCompanyAvatar(company) {
  if (company === "초자연 재난관리국") return '<img class="avatar-image" src="assets/avatar-disaster.svg" alt="초자연 재난관리국">';
  if (company === "일반 회사") return '<img class="avatar-image" src="assets/avatar-general.svg" alt="일반 회사">';
  return '<img class="avatar-image" src="assets/avatar-daydream.svg" alt="백일몽">';
}


function renderPostCard(post) {
  return `
    <article class="post post-clickable" data-open-post="${post.id}" tabindex="0" role="link" aria-label="${post.title} 상세 페이지로 이동">
      <div class="post-header">
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
      <p>${post.body}</p>
      <div class="post-footer">
        <div class="action-row">
          <button class="action-button ${post.liked ? "active" : ""}" type="button" data-like="${post.id}">좋아요 ${post.likes}</button>
          <button class="action-button" type="button" data-open-post="${post.id}">댓글 ${getCommentCount(post)}</button>
          <button class="action-button ${post.saved ? "active" : ""}" type="button" data-save="${post.id}">${post.saved ? "저장됨" : "저장"}</button>
        </div>
        <span class="post-meta">상세 페이지에서 댓글 보기</span>
      </div>
    </article>
  `;
}

function renderPosts() {
  const posts = getVisiblePosts();

  if (!posts.length) {
    feed.innerHTML = '<div class="empty-state">이 피드 조건에 맞는 게시글이 없습니다.</div>';
    return;
  }

  feed.innerHTML = `
    <div class="community-heading">
      <div>
        <p class="eyebrow">전체 피드</p>
        <h2>${state.view === "company" || state.filter === "mine" ? "내 소속 글" : "GDCH 전체 글"}</h2>
      </div>
      <span>${posts.length}개의 글</span>
    </div>
    ${posts.map(renderPostCard).join("")}
  `;
}

function renderChips() {
  chips.innerHTML = data.keywords.map((word) => `<button class="chip" type="button" data-keyword="${word}">#${word}</button>`).join("");
}

function updateCounts() {
  const posts = getCommunityPosts();
  document.querySelector("#memberCount").textContent = "3,842";
  document.querySelector("#todayCount").textContent = String(posts.length + 12);
  document.querySelector("#hotCount").textContent = String(posts.filter((post) => post.likes >= 30).length);
}

function render() {
  renderProfile();
  renderIdentity();
  renderPosts();
  renderChips();
  updateCounts();
}

function resetListView() {
  composer.classList.add("hidden");
}

function updatePost(postId, updater) {
  const posts = data.getPosts();
  const post = posts.find((item) => item.id === Number(postId));
  if (!post) return;
  updater(post);
  data.savePosts(posts);
  render();
}

function openPost(postId) {
  window.location.href = `post.html?id=${postId}`;
}

document.querySelectorAll(".auth-tab").forEach((button) => {
  button.addEventListener("click", () => showAuthTab(button.dataset.authTab));
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const users = data.getUsers();
  const name = document.querySelector("#signupName").value.trim();
  const email = document.querySelector("#signupEmail").value.trim().toLowerCase();
  const password = document.querySelector("#signupPassword").value;
  const company = new FormData(signupForm).get("signupCompany");

  if (users.some((user) => user.email === email)) {
    signupMessage.textContent = "이미 가입된 이메일입니다. 로그인해 주세요.";
    return;
  }

  const user = { name, email, password, company };
  users.push(user);
  data.saveUsers(users);
  setSession(user);
  signupForm.reset();
  showApp();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
  const password = document.querySelector("#loginPassword").value;
  const user = data.getUsers().find((item) => item.email === email && item.password === password);

  if (!user) {
    loginMessage.textContent = "이메일 또는 비밀번호가 맞지 않습니다.";
    return;
  }

  setSession(user);
  loginForm.reset();
  showApp();
});

document.querySelector("#demoLogin").addEventListener("click", () => {
  const demo = {
    name: "데모 직장인",
    email: "demo@gdch.local",
    password: "demo",
    company: "(주) 백일몽 주식회사",
  };
  const users = data.getUsers();
  if (!users.some((user) => user.email === demo.email)) {
    users.push(demo);
    data.saveUsers(users);
  }
  setSession(demo);
  showApp();
});

document.querySelector("#logoutButton").addEventListener("click", showAuth);

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    resetListView();
    document.querySelectorAll(".segment").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderPosts();
  });
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    resetListView();
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.view = button.dataset.view;
    renderPosts();
  });
});

document.querySelector("#openComposer").addEventListener("click", () => {
  renderPosts();
  composer.classList.toggle("hidden");
  if (!composer.classList.contains("hidden")) postTitle.focus();
});

document.querySelector("#cancelPost").addEventListener("click", () => {
  composer.classList.add("hidden");
  postTitle.value = "";
  postBody.value = "";
});

document.querySelector("#publishPost").addEventListener("click", () => {
  const title = postTitle.value.trim();
  const body = postBody.value.trim();

  if (!title || !body) {
    postTitle.focus();
    return;
  }

  const posts = data.getPosts();
  posts.unshift({
    id: Date.now(),
    company: state.company,
    type: postType.value,
    title,
    body,
    author: `${state.user.name} 익명`,
    time: "방금 전",
    likes: 0,
    comments: [],
    saved: false,
    liked: false,
  });
  data.savePosts(posts);

  postTitle.value = "";
  postBody.value = "";
  composer.classList.add("hidden");
  state.view = "home";
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === "home"));
  render();
});

searchInput.addEventListener("input", (event) => {
  resetListView();
  state.query = event.target.value;
  renderPosts();
});

feed.addEventListener("click", (event) => {
  const likeButton = event.target.closest("[data-like]");
  const saveButton = event.target.closest("[data-save]");
  const openTarget = event.target.closest("[data-open-post]");

  if (likeButton) {
    updatePost(likeButton.dataset.like, (post) => {
      post.liked = !post.liked;
      post.likes += post.liked ? 1 : -1;
    });
    return;
  }

  if (saveButton) {
    updatePost(saveButton.dataset.save, (post) => {
      post.saved = !post.saved;
    });
    return;
  }

  if (openTarget) {
    openPost(openTarget.dataset.openPost);
  }
});

feed.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const openTarget = event.target.closest("[data-open-post]");
  if (openTarget) openPost(openTarget.dataset.openPost);
});

chips.addEventListener("click", (event) => {
  const keyword = event.target.dataset.keyword;
  if (!keyword) return;
  resetListView();
  searchInput.value = keyword;
  state.query = keyword;
  renderPosts();
});

const sessionUser = data.getSessionUser();
if (sessionUser) {
  setSession(sessionUser);
  showApp();
} else {
  showAuth();
}





