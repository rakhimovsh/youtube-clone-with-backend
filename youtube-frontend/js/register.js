const elForm = document.querySelector(".site-form");

elForm.onsubmit = async function (evt) {
  evt.preventDefault();
  const { username, password, file } = evt.target.elements;
  let formData = new FormData();
  formData.append("file", file.files[0]);
  formData.append("username", username.value);
  formData.append("password", password.value);
  let res = await fetch(API + "/register", {
    method: "POST",
    body: formData,
  });
  let data = await res.json();
  console.log(data);
  if (data.status != 201) return alert(data.message);
  window.localStorage.setItem("token", JSON.stringify(data.token));
  window.localStorage.setItem("user", JSON.stringify(data.data));
  window.location.href = "../admin.html";
  alert(data.message);
};
