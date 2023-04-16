const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");
const videoContainer = document.getElementById("videoContainer")

const submitHandler = (event) => {
    event.preventDefault();
    const { id } = videoContainer.dataset
    const text = JSON.stringify(textarea.value)
    fetch(`/api/videos/${id}/comment`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text:"Dfdf", rating:"fdfdfd"})
    })
}

btn.addEventListener("click", submitHandler)