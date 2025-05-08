import { LightningElement } from 'lwc';

const LOGTAG = "weatherCompare";
const API_KEY = "27d417302bce45e19ea105504250805"
const API_BASE = "https://api.weatherapi.com/v1/"
export default class WeatherCompare extends LightningElement {
  tempDifference

  connectedCallback() {
    console.log(LOGTAG, "connectedCallback");

    // Get geolocation
    if (navigator.geolocation) {
      console.log("Locating…");
      navigator.geolocation.getCurrentPosition(
        async s => {
            console.log("success", s);
            try {
              const currentTemperature = await this.getTemperature(s.coords.latitude, s.coords.longitude);
              console.log(LOGTAG, "currentTemperature", currentTemperature);
              if (currentTemperature){
                this.tempDifference = 30.5 - currentTemperature;
              }
            } catch  (error) {
              console.error(LOGTAG, "getTemperature error", JSON.parse(JSON.stringify(error)));
            }
        },
        e => {
            console.error("error", e);
        }
      );
    }
  }

  async getTemperature(lat, long) {
    console.log(LOGTAG, "getTemperature", lat, long);
    const url = `${API_BASE}current.json?key=${API_KEY}&q=${lat},${long}&aqi=no`;
    console.log(LOGTAG, "getTemperature", url);
    try {
      const response = await fetch(url);
      console.log(LOGTAG, "response", response);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(LOGTAG, json);
      return json?.current?.temp_c ?? null;
    } catch (error) {
      console.error(LOGTAG, error.message);
    }
  }
}