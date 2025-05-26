import { LightningElement, api } from 'lwc';
import { updateRecord } from "lightning/uiRecordApi";
import STATUS_FIELD from "@salesforce/schema/Case.Status";
import ID_FIELD from "@salesforce/schema/Case.Id";

export default class T2sCaseControl extends LightningElement {
  @api recordId;
  inProgress;
  recognition;

  connectedCallback() {
    console.log('handleT2S');
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    var commands = [ 'close' , 'reopen'];

    this.recognition = new SpeechRecognition();
    if (SpeechGrammarList) {
      // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
      // This code is provided as a demonstration of possible capability. You may choose not to use it.
      var speechRecognitionList = new SpeechGrammarList();
      var grammar = '#JSGF V1.0; grammar commands; public <command> = ' + commands.join(' | ') + ' ;'
      speechRecognitionList.addFromString(grammar, 1);
      this.recognition.grammars = speechRecognitionList;
    }
    this.recognition.continuous = false;
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    let command;
    let confidence;

    this.recognition.onresult = (event) => {
      console.log("onresult");
      // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
      // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
      // It has a getter so it can be accessed like an array
      // The first [0] returns the SpeechRecognitionResult at the last position.
      // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
      // These also have getters so they can be accessed like arrays.
      // The second [0] returns the SpeechRecognitionAlternative at position 0.
      // We then return the transcript property of the SpeechRecognitionAlternative object
      command = event.results[0][0].transcript;
      console.log('Result received: ' + command + '.');
      confidence = event.results[0][0].confidence;
      console.log('Confidence: ' + event.results[0][0].confidence);
    }

    this.recognition.onspeechend = async () => {
      console.log("onspeechend.");
      if (confidence > 0.5) {
        console.log("will updateStatus", command);
        await this.updateStatus(command);
      } else {
        console.log("Doing nothing")        
      }
      this.recognition.stop();
    }

    this.recognition.onnomatch = (event) => {
      console.log("I didn't recognise that command.");
    }

    this.recognition.onerror = (event) => {
      console.warn('Error occurred in recognition: ' + event.error);
    }
  }

  startT2S() {
    this.recognition.start();
    console.log('Ready to receive a command command.');
  }


  async updateStatus(command) {
    // console.log("updateStatus");
    try {
      // console.log("updateStatus", command)
      let status;
      switch (command) {
        case 'close':
          status = 'Closed';
          break;
        case 'reopen':
          status = 'Open';
          break;
      }
      if (!status) {
        console.warn("Sorry, I don't know that command:", command);
        console.warn("Computer says no.");
        return;
      }

      const fields = {};
      fields[ID_FIELD.fieldApiName] = this.recordId;
      fields[STATUS_FIELD.fieldApiName] = status;
      const recordInput = { fields };
      // console.log("updateStatus", recordInput);
      this.inProgress = true;
      updateRecord(recordInput)
        .then(result => {
        // console.log('OK RESULT==>>> '+JSON.stringify(result));
        this.inProgress = false;
            this.cases = result;
            this.error = undefined;
            return;
        })
        .catch(error => {
          this.inProgress = false;
            console.error(error);
            this.error = error;
            this.cases = undefined;
            return;
        });
    } catch (error) {
      this.inProgress = false;
      console.error("AAH", error);
    }
   }
}