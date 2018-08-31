namespace('App.Views')

class Tooltip {
  constructor ({ element, model }) {
    this.element = element
    this.model = model

    this.model.on('change', () => this.render())
  }

  _templateMeasurement ({ key, measurement }) {
    const time = measurement.time ? `${new Date(measurement.time).toLocaleString()}` : ''
    const unit = (measurement.unit || '').replace('ft3\/', 'cf').replace('deg C', '&deg;C')
    const value = measurement.value || '-'

    return `
      <div class="line">
        ${this._templateKeyValue({
          key, value: `
            <span class="measurement-value">${value} ${unit}</span>
            <span class="time">${time}</span>
          `
        })}
      </div>
    `
  }

  _templateKeyValue ({ key, value }) {
    return `
      <span class="field">${key}</span>
      <span class="value">${value}</span>
    `
  }

  template ({ station, latitude, longitude, height, flow, temp, livecam }) {
    const name = station.replace(', NC', '').toLowerCase()

    return `
      <p class="station">${name}</p>
      <hr />
      ${this._templateMeasurement({ key: 'height', measurement: height })}
      ${this._templateMeasurement({ key: 'flow', measurement: flow })}
      ${this._templateMeasurement({ key: 'temp', measurement: temp })}
    `
  }

  render () {
    this.element.innerHTML = this.template(this.model.toJSON())
  }
}


App.Views.Tooltip = Tooltip
