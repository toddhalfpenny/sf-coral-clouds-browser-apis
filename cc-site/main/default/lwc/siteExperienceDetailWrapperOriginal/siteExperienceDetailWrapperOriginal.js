import { LightningElement, wire, api  } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
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
  reviews

  @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
  getExperience({error, data}) {
    console.log(LOGTAG, "getExperience", data, error)
    if (data) {
      this.experience = data;
    }
  };
  @wire(getExperienceReviews, { experienceId: '$recordId' })
  wiredReviews({error, data}) {
    console.log(LOGTAG, "wiredReviews", data, error)
    if (data) {
      this.reviews = data;
    }
  };

  connectedCallback() {
    console.log(LOGTAG, "connectedCallback this.recordId", this.recordId);
  }

  renderedCallback() {
    console.log(LOGTAG, "renderedCallback");
  };

}