import { LightningElement, api, wire } from 'lwc';
import getExperienceReviews from '@salesforce/apex/ExperienceController.getExperienceReviews';

const LOGTAG = "SiteExpWrapper";

export default class ExperienceReviewPiP extends LightningElement {
  @api recordId;
  reviews
  
  @wire(getExperienceReviews, { experienceId: '$recordId' })
  getReviews({error, data}) {
    console.log(LOGTAG, "getReviews", data, error)
    if (data) {
      this.reviews = data;
    }
  };

  async popoutReviews() {
    const isPipSupported = "documentPictureInPicture" in window;
    console.log("reviews", this.reviews.length);
    console.log("isPipSupported", isPipSupported);
    if (isPipSupported) {
      const pipWindow = await documentPictureInPicture.requestWindow({
        width: window.innerWidth,
        height: window.innerHeight,
      })

      let myContent = '<h1>Guest reviews</h1><table><thead><tr><td>Rating</td><td>Comment</td></tr></thead><tbody>'
      this.reviews.forEach((review) => {
        myContent += `<tr><td class="rating">${review.Rating__c}</td><td class="comments">${review.Comments__c}</td></tr>`;
      });
      myContent += '</tbody></table>';
      pipWindow.document.documentElement.innerHTML = myContent;
      // pipWindow.document.body.append(this.myContent);

      const style = pipWindow.document.createElement("style");
        style.innerHTML = `
      body {
        font-family: sans-serif;
      }
      h1 {
        font-size: 1em;
      }
      table {
        font-size: 0.6em;
      }
      thead {
        font-weight: bold;
        background-color: darkgray;
      }
      td:first-of-type {
        text-align: center;
      }
      tbody tr:nth-of-type(even) {
        background-color: lightgray;
      }
      `
      pipWindow.document.head.appendChild(style);
    }
  }
}