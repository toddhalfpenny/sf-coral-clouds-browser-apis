import { LightningElement } from 'lwc';

const width = 320;    // We will scale the photo width to this
const height = 0;     // This will be computed based on the input stream

const streaming = false;

export default class SelfieSharer extends LightningElement {
  video;
  canvas;
  photo;

  renderedCallback() {
    console.log("renderedCallback");
    this.video = this.refs.video;
    this.canvas = this.refs.canvas;
    this.photo = this.refs.photo;

    navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      console.log("getUserMedia stream OK");
      this.video.srcObject = stream;
      this.video.play();
    })
    .catch((err) => {
      console.error(`An error occurred: ${err}`);
    });
  }

  captureImage() {
    console.log("handleClick");
    const context = this.canvas.getContext("2d");
    if (this.video && this.video.srcObject !== null) {
      console.log("handleClick 1");
      this.canvas.width = this.video.videoWidth;
      this.canvas.height = this.video.videoHeight;
      context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
  
      const data = this.canvas.toDataURL("image/png");
      this.photo.setAttribute("src", data);
      console.log("data", data);
    } else {
      console.log("handleClick 2");
      clearPhoto();
    }
  }

  clearPhoto() {
    console.log("clearPhoto");
    const context = this.canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
    const data = this.canvas.toDataURL("image/png");
    this.photo.setAttribute("src", data);
  }

  async shareImage() {
    console.log("shareImage");
    // const data = this.canvas.toDataURL("image/png");
    // const blob = await (await fetch(data)).blob();
    this.canvas.toBlob( blob => {
      console.log("blob", blob);
      const filesArray = [
        new File(
          [blob],
          'czechdreamin.jpg',
          {
            type: blob.type,
            lastModified: new Date().getTime()
          }
        )
      ];
      const shareData = {
        title: "Hullo from CzechDreamin",
        text: "Hello there from CzechDreamin 2025!\nThings are really kicking off here.",
        files: filesArray,
      };
      navigator.share(shareData);
    });
  }
}