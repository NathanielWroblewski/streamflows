namespace('App.Models')

class Datum {
  constructor ({ station, position: [long, lat], height, flow, temp, livecam }) {
    this.station = station
    this.latitude = lat
    this.longitude = long
    this.height = height
    this.flow = flow
    this.temp = temp
    this.livecam = livecam

    this._on = {}
  }

  on (eventName, callback) {
    this._on[eventName] = callback
  }

  trigger (eventName) {
    this._on[eventName](this.toJSON())
  }

  update ({ station, position: [long, lat], height, flow, temp, livecam }) {
    this.station = station
    this.latitude = lat
    this.longitude = long
    this.height = height
    this.flow = flow
    this.temp = temp
    this.livecam = livecam

    this.trigger('change')
  }

  toJSON () {
    return {
      station: this.station,
      latitude: this.latitude,
      longitude: this.longitude,
      height: this.height,
      flow: this.flow,
      temp: this.temp,
      livecam: this.livecam,
    }
  }
}

App.Models.Datum = Datum
