namespace('App.Models')

const VARIABLE_MAP = {
  'Gage height, ft': 'height',
  'Streamflow, ft&#179;/s': 'flow',
  'Temperature, water, &#176;C': 'temp',
}

const LIVECAMS = {
  '0214642825': '//finslive.mecklenburgcountync.gov/finslive/webcam.html?cam=3',
  '02146449': '//finslive.mecklenburgcountync.gov/finslive/webcam.html?cam=9',
  '02146470': '//finslive.mecklenburgcountync.gov/finslive/webcam.html?cam=13',
  '02146409': '//finslive.mecklenburgcountync.gov/finslive/webcam.html?cam=1',
  '0214668150': '//finslive.mecklenburgcountync.gov/finslive/webcam.html?cam=8',
}

class Dataset {
  constructor ({ dataset }) {
    this.data = this._condense(dataset)
  }

  _condense (data) {
    return data.value.timeSeries.reduce((memo, datum) => {
      const id = datum.sourceInfo.siteCode[0].value
      const name = datum.sourceInfo.siteName
      const lat = datum.sourceInfo.geoLocation.geogLocation.latitude
      const long = datum.sourceInfo.geoLocation.geogLocation.longitude
      const variable = VARIABLE_MAP[datum.variable.variableName]
      const unit = datum.variable.unit.unitCode
      const value = datum.values[0].value[0].value
      const time = datum.values[0].value[0].dateTime

      if (!memo[name]) memo[name] = {}

      memo[name].position = [long, lat]
      memo[name].livecam = LIVECAMS[`${id}`]
      memo[name][variable] = { unit, value, time }

      return memo
    }, {})
  }

  toJSON () {
    return Object.keys(this.data).map(station => {
      const { position, livecam, height = {}, flow = {}, temp = {} } = this.data[station]

      return { station, position, height, flow, temp, livecam, }
    });
  }
}

App.Models.Dataset = Dataset
