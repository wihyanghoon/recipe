const form = document.getElementById("commentForm");
const textarea = form.querySelector("input");
const btn = form.querySelector("button");
const videoContainer = document.getElementById("videoContainer");

const submitHandler = (event) => {
  event.preventDefault();
  const { id } = videoContainer.dataset;
  const text = textarea.value;

  if(text.trim() === "") {
    return ;
  }

  fetch(`/api/videos/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  
  setInterval(()=>{
    window.location.reload();
  }, 1000)
  
};

btn.addEventListener("click", submitHandler);
