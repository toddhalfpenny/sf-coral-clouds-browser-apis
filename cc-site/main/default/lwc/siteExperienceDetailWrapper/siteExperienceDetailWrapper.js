import { LightningElement, wire, api  } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getExperienceReviews from '@salesforce/apex/ExperienceController.getExperienceReviews';

import NAME_FIELD from '@salesforce/schema/Experience__c.Name';
import DESC_FIELD from '@salesforce/schema/Experience__c.Description__c';
import RATING_FIELD from '@salesforce/schema/Experience__c.Rating__c';

const LOGTAG = "SiteExpWrapper";
const FIELDS = [
    NAME_FIELD,
    DESC_FIELD,
    RATING_FIELD
];

export default class SiteExperienceDetailWrapper extends LightningElement {
  @api recordId;
  experience
  descriptionElem
  areReviewsShown = false
  reviews

  @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    getExperience({error, data}) {
      console.log(LOGTAG, "getExperience", data, error)
      if (data) {
        this.experience = data;
      }
    };

  connectedCallback() {
    console.log(LOGTAG, "connectedCallback this.recordId", this.recordId);
  }

  renderedCallback() {
    this.descriptionElem = this.refs.description;
    console.log(LOGTAG, "renderedCallback", this.descriptionElem);
    // IntersectionObserver for loading the reviews
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };
    
    setTimeout(() => {
      try  {
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            console.log("entry", entry);
            if (this.experience && !this.areReviewsShown && entry.intersectionRatio > 0.5) {
              // Stop watching
              observer.unobserve(this.descriptionElem);
              observer.disconnect();
              this.fetchReviews();

            } else {
              console.log("not fetching");
            }
          });
        }, options);
        console.log(observer);
        observer.observe(this.descriptionElem);
      } catch (e) {
        console.warn("INTERSECTION Error", e);
      }
    }, 1500);
  }

  async fetchReviews() {
    console.log(LOGTAG, "fetchReviews", this.recordId);
    this.areReviewsShown = true;
    try {
      this.reviews = await getExperienceReviews({ experienceId: this.recordId });
      console.log(LOGTAG, "fetchReviews", this.reviews, this.reviews?.length);
    } catch (error) {
      console.error(LOGTAG, "fetchReviews", error);
      // this.error = error;
      this.reviews = undefined;
    }
  }

}