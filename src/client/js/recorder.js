import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';


const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

//전역변수
let stream;
let recorder;
let videoFile;

const startHandler = () => {
  startBtn.innerText = "Stop recoding";
  startBtn.removeEventListener("click", startHandler);
  startBtn.addEventListener("click", handleStopHandler);

  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };

  recorder.start();
};

const handleStopHandler = () => {
  startBtn.innerText = "DownLoad";
  startBtn.removeEventListener("click", handleStopHandler);
  startBtn.addEventListener("click", downLoadHandler);
  recorder.stop();
};

const downLoadHandler = async () => {
    const ffmpeg = createFFmpeg({
        mainName: 'main',
        corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
        log: true,
        });
    await ffmpeg.load();
       
    
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile))
    await ffmpeg.run("-i", "recording.webm", "-r", "60" ,"output.mp4")

    await ffmpeg.run("-i", "recording.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg");

    const mp4File = ffmpeg.FS("readFile", "output.mp4")
    const thubFile = ffmpeg.FS("readFile", "thumbnail.jpg")
    console.log(thubFile)

    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4"})
    const thumbBlob = new Blob([thubFile.buffer], {type : "image/jpg"})

    const mp4Url = URL.createObjectURL(mp4Blob)
    const thumUrl = URL.createObjectURL(thumbBlob)

    const a = document.createElement("a")
    a.href = mp4Url;
    a.download = "myVideo.mp4";
    document.body.appendChild(a)
    a.click();

    const thumA = document.createElement("a")
    thumA.href = thumUrl;
    thumA.download = "MyThumnail.jpg";
    document.body.appendChild(thumA)
    thumA.click();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  console.log(stream);
  video.srcObject = stream;
  video.play();
};
init();

startBtn.addEventListener("click", startHandler);
