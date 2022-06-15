let token = JSON.parse(window.localStorage.getItem("token"));
let user = JSON.parse(window.localStorage.getItem("user"));
let elUsersList = document.querySelector(".navbar-list");
let elVideosList = document.querySelector(".iframes-list");
let elSearchForm = document.querySelector(".search-box");
loginUser.onclick = function () {
  if (!token) loginUser.href = "./login.html";
  else loginUser.href = "./admin.html";
};

function renderAdminUser() {
  if (!user) {
    loginUser.innerHTML = `<img
    class="avatar-img"
    src="./img/avatar.jpg"
    alt="avatar-img"
    width="32px"
    height="32px"
  />`;
  } else {
    loginUser.innerHTML = `
    <img
              class="avatar-img"
              src="${API + "/" + user.avatar}"
              alt="avatar-img"
              width="32px"
              height="32px"
            />
    `;
  }
}

function renderUsers(users, element) {
  element.innerHTML = null;
  let defaultItem = `
    <h1>YouTube Members</h1>
    <li class="channel active" data_id="main">
        <a href="#">
        <svg
            viewbox="0 0 24 24"
            focusable="false"
            style="
            pointer-events: none;
            display: block;
            width: 30px;
            height: 30px;
        "
        >
        <g>
            <path
            d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8"
            class="style-scope yt-icon"
            ></path>
        </g>
        </svg>
        <span>Home</span>
        </a>
    </li>
    `;
  element.innerHTML = defaultItem;
  users.forEach((user) => {
    let newItem = `
    <li class="channel" data-id="${user.userId}">
        <a href="#">
        <img
         src="${API}/${user.avatar}"
         alt="channel-icon"
         width="30px"
         height="30px"
        />
        <span>${user.username}</span>
        </a>
    </li>`;
    element.insertAdjacentHTML("beforeend", newItem);
  });
}

async function getUsers() {
  let res = await fetch(API + "/users");
  let data = await res.json();

  renderUsers(data, elUsersList);
}

function renderVideos(videos, element) {
  element.innerHTML = null;
  videos.forEach((video) => {
    let uploadDate = new Date(video.videoDate)
      .toISOString()
      .replace(/T/gi, " ")
      .split(" ");
    let getHour = uploadDate[1].slice(0, 5);
    uploadDate[1] = getHour;
    uploadDate = uploadDate.join(" | ");
    let newItem = `
    <li class="iframe admin-iteam">
      <video
        src="${API + video.view}"
        controls=""
      ></video>
      <div class="iframe-footer">
        <img
          src="${API + "/" + video.user.avatar}"
          alt="channel-icon"
        />
        <div class="iframe-footer-text">
          <h2 class="channel-name">${video.user.username}</h2>
          <h3 class="iframe-title">${video.videoTitle}</h3>
          <time class="uploaded-time">${uploadDate}</time>
          <a class="download" href="${API + video.download}">
            <span>${Math.ceil(video.size / 1024 / 1024)}MB</span>
            <img src="./img/download.png" />
          </a>
        </div>
      </div>
    </li>
    `;
    element.insertAdjacentHTML("beforeend", newItem);
  });
}
elUsersList.onclick = (evt) => {
  for (let el of evt.currentTarget.children) {
    if (el.classList.contains("active")) {
      el.classList.remove("active");
    }
  }
  evt.path.forEach(async (el) => {
    if (el.tagName == "LI" && el.classList.contains("channel")) {
      el.classList.add("active");
      let userId = el.dataset.id;
      userId = userId ? `?userId=${userId}` : "";
      let res = await fetch(API + "/video" + userId);
      let data = await res.json();
      renderVideos(data.data, elVideosList);
    }
  });
};
elSearchForm.onsubmit = async (evt) => {
  evt.preventDefault();
  let { search } = evt.target.elements;
  let route = search.value ? `?search=${search.value}` : "";
  let res = await fetch(API + "/video" + route);
  let data = await res.json();
  renderVideos(data.data, elVideosList);
  search.value = null;
};

async function getVideos() {
  let res = await fetch(API + "/video");
  let data = await res.json();
  renderVideos(data.data, elVideosList);
}

let recordeing = new webkitSpeechRecognition();
recordeing.lang = "en-US";
recordeing.onresult = (result) => {
  serachInput.value = result.results[0][0].transcript;
};
mic.onclick = () => {
  recordeing.start();
};

renderAdminUser();
getUsers();
getVideos();
