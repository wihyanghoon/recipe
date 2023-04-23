const form = document.getElementById("commentForm");
const textarea = form.querySelector("input");
const btn = form.querySelector("button");
const videoContainer = document.getElementById("videoContainer");
const comment__wrap = document.querySelector(".comment__wrap");
const comment__delete = document.querySelector(".comment__delete");

const comments__wrap = document.querySelector(".comments__wrap ul");

const upDateComente = (text, comment) => {
  const { _id, owner } = comment;
  const li = document.createElement("li");
  const img = document.createElement("img");
  const div = document.createElement("div");
  const a = document.createElement("a");
  const p = document.createElement("p");
  const deleteWrap = document.createElement("div");
  const span = document.createElement("span");

  li.className = "comment__wrap";
  li.dataset.id = _id;
  img.className = "comment__img";
  div.className = "comment__text";
  deleteWrap.className = "comment__delete"
  a.innerText = owner.email;
  a.href = `/users/${owner._id}`;
  img.src = owner.avatar;

  comments__wrap.prepend(li);
  li.appendChild(img);
  li.appendChild(div);
  li.appendChild(deleteWrap)
  div.appendChild(a);
  div.appendChild(p);
  deleteWrap.appendChild(span);
  deleteWrap.addEventListener("click", deleteHandler)
  p.innerText = text;
};

const submitHandler = async (event) => {
  event.preventDefault();
  const { id } = videoContainer.dataset;
  const text = textarea.value;

  if (text.trim() === "") {
    return;
  }

  const responce = await fetch(`/api/videos/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const json = await responce.json();

  upDateComente(text, json.comment);
};

const deleteHandler = () => {
  const { id } = videoContainer.dataset;
  const { id: commentId } = comment__wrap.dataset;

  fetch(`/api/videos/${id}/comment/${commentId}/delete`, {
    method: "POST",
  });
};

btn.addEventListener("click", submitHandler);


comment__delete.addEventListener("click", deleteHandler);
