const token = JSON.parse(window.localStorage.getItem("token"));
const adminUser = JSON.parse(window.localStorage.getItem("user"));
const elUploadForm = document.querySelector(".site-form");
if (!token) window.location.href = "../login.html";

logoutBtn.onclick = () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  window.location.reload();
};

elUploadForm.onsubmit = async (evt) => {
  evt.preventDefault();
  const { videoTitle, video } = evt.target.elements;
  let formData = new FormData();
  formData.append("video", video.files[0]);
  formData.append("videoTitle", videoTitle.value);
  formData.append("userId", adminUser.userId);
  let res = await fetch(API + "/admin/video", {
    method: "POST",
    headers: {
      token: token,
    },
    body: formData,
  });
  let data = await res.json();
  alert(data.message);
  videoTitle.value = null;
  video.files = null;
};

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
          <button data-video-id="${
            video.videoId
          }" class="delete-btn">Delete</button>
        </div>
      </div>
    </li>
    `;
    element.insertAdjacentHTML("beforeend", newItem);
  });
}

async function getVideos() {
  let res = await fetch(API + "/admin/video", {
    method: "GET",
    headers: {
      token: token,
    },
  });
  let data = await res.json();
  renderVideos(data.data, videosList);
}

// Function for delete videos
videosList.onclick = async (evt) => {
  let deleteBtn = evt.target.classList.contains("delete-btn");
  if (deleteBtn) {
    let { videoId } = evt.target.dataset;
    let res = await fetch(API + "/admin/video/" + videoId, {
      method: "DELETE",
      headers: {
        token: token,
      },
    });
    let data = await res.json();
    alert(data.message);
  }
};
getVideos();
