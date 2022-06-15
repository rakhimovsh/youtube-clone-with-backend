const elForm = document.querySelector(".site-form");

elForm.onsubmit = async function (evt) {
  evt.preventDefault();
  const { username, password } = evt.target.elements;

  let res = await fetch(API + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  });
  let data = await res.json();
  if (data.status != 200) return alert(data.message);
  console.log(data);
  window.localStorage.setItem("token", JSON.stringify(data.token));
  window.localStorage.setItem("user", JSON.stringify(data.data));
  window.location.href = "../admin.html";
  alert(data.message);
};
