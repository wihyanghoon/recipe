import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';


const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

//전역변수
let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg"
}

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a")
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a)
    a.click();
}

const startHandler = () => {
  actionBtn.innerText = "Stop recoding";
  actionBtn.removeEventListener("click", startHandler);
  actionBtn.addEventListener("click", handleStopHandler);

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
  actionBtn.innerText = "DownLoad";
  actionBtn.removeEventListener("click", handleStopHandler);
  actionBtn.addEventListener("click", downLoadHandler);
  recorder.stop();
};

const downLoadHandler = async () => {
    actionBtn.removeEventListener("click", downLoadHandler)

    actionBtn.innerText = "변환중..."
    actionBtn.disabled = true
    const ffmpeg = createFFmpeg({
        mainName: 'main',
        corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
        log: true,
        });
    await ffmpeg.load();
       
    
    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile))

    await ffmpeg.run("-i", files.input, "-r", "60" , files.output)
    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);
    await ffmpeg.runWithPromise("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);

    const mp4File = ffmpeg.FS("readFile", files.output)
    const thubFile = ffmpeg.FS("readFile", files.thumb)
    
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4"})
    const thumbBlob = new Blob([thubFile.buffer], {type : "image/jpg"})

    const mp4Url = URL.createObjectURL(mp4Blob)
    const thumUrl = URL.createObjectURL(thumbBlob)

    downloadFile(mp4Url, "myrecoding.mp4")
    downloadFile(thumUrl, "MyThumnail.jpg")

    actionBtn.disabled = false
    actionBtn.innerText = "녹화 다시하기"
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


actionBtn.addEventListener("click", startHandler);
