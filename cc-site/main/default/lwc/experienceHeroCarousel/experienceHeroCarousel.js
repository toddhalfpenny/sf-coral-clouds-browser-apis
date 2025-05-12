import { LightningElement } from 'lwc';
import expImages from '@salesforce/resourceUrl/coralcloudsite';
const LOGTAG = "experienceHeroCarousel";

export default class ExperienceHeroCarousel extends LightningElement {
  isFullScreen = false;
  landscapePopover;
  portraitPopover;
  expImage01 = expImages + '/exp-carousel-01.jpg';
  expImage02 = expImages + '/exp-carousel-03.jpg';
  expImage03 = expImages + '/exp-carousel-04.jpg';
  expImage02Rotated = expImages + '/exp-carousel-02-rotated.jpg';

  renderedCallback() {
    this.landscapePopover = this.template.querySelector(".landscapePopover");
    this.portraitPopover = this.template.querySelector(".portraitPopover");

    console.log("Adding listener for deviceorientation");
    // window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
    //   const portrait=e.matches;
    //   if(portrait){ 
    //     console.log("portrait");
    //     }
    //   else{ 
    //     console.log("landscape");
    //     }
    // });
  }

  handleFullScreen() {
    console.log(LOGTAG, "handleFullScreen");
    // this.isFullScreen = !this.isFullScreen;

    //TODO Check whether in landscape or potrait
    const mql = window.matchMedia("(orientation: portrait)");
    if (mql.matches) {
      console.log("portrait");
      const popupOpened = this.portraitPopover.togglePopover();
      console.log("popupOpened", popupOpened);
    } else {
      console.log("landscape");
      const popupOpened = this.landscapePopover.togglePopover();
      console.log("popupOpened", popupOpened);
    }
  }

  handleNonFullScreen() {
    console.log(LOGTAG, "handleNonFullScreen");
    this.isFullScreen = !this.isFullScreen;
  }

  handleOrientation(event) {
    console.log("DeviceOrientation", event);
  }
}