const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");

const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");


const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);


if(isIOS){
  video.setAttribute('controls', true);
  videoControls.style.display = "none"
}
//전역변수
let timeOutId = null;
let controlMove = null;

const playClickHandler = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const muteHandler = () => {
  console.log(video.muted);
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : 0.5;
};

const volumeHandler = (event) => {
  const { value } = event.target;

  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }

  if (Number(value) === 0) {
    video.muted = true;
    muteBtnIcon.classList = "fas fa-volume-mute";
  } else {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-up";
  }

  video.volume = value;
};

const loadMetaHandler = () => {
  const getTime = new Date(video.duration * 1000)
    .toISOString()
    .substring(11, 19);
  totalTime.innerText = getTime;
  timeline.max = Math.floor(video.duration);
};

const timeHandler = () => {
  const getTime = new Date(video.currentTime * 1000)
    .toISOString()
    .substring(11, 19);
  currenTime.innerText = getTime;
  timeline.value = video.currentTime;
};

const timelineHandler = (event) => {
  video.currentTime = event.target.value;
};

const fullHandler = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const mouseMoveHandler = () => {
  if (timeOutId) {
    clearTimeout(timeOutId);
    timeOutId = null;
  }
  if (controlMove) {
    clearTimeout(controlMove); // settime 취소
    controlMove = null;
  }
  videoControls.classList.add("showing");
  controlMove = setTimeout(hideControls, 3000);
};

const mouseOutHandler = () => {
  timeOutId = setTimeout(hideControls, 3000);
};

const ketdownHandler = (e) => {
  if (document.fullscreenElement) {
    fullScreenIcon.classList = "fas fa-compress";
  } else {
    fullScreenIcon.classList = "fas fa-expand";
  }
};

const videoEndHandler = () => {
  const { id } = videoContainer.dataset;
  console.log(id);
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

const ketdownPlayHandler = (e) => {
  console.log(e.keyCode);
  if (e.keyCode === 32) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

playBtn.addEventListener("click", playClickHandler);
muteBtn.addEventListener("click", muteHandler);
volumeRange.addEventListener("input", volumeHandler);
video.readyState
  ? loadMetaHandler()
  : video.addEventListener("loadedmetadata", loadMetaHandler);
timeHandler();

video.addEventListener("timeupdate", timeHandler);
videoContainer.addEventListener("mousemove", mouseMoveHandler);
video.addEventListener("click", playClickHandler);
videoContainer.addEventListener("mouseleave", mouseOutHandler);
video.addEventListener("ended", videoEndHandler);
timeline.addEventListener("input", timelineHandler);
fullScreenBtn.addEventListener("click", fullHandler);
videoContainer.addEventListener("fullscreenchange", ketdownHandler);

window.addEventListener("keydown", ketdownPlayHandler);
