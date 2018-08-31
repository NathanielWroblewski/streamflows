class Measurements extends App.Views.Projection {
  constructor (attrs) {
    super(attrs)

    this.model = attrs.model
  }

  _handleClick ({ livecam }) {
    if (livecam) {
      window.location.href = livecam
    }
  }

  _handleMouseOver (datum) {
    this.model.update(datum)
  }

  _handleMouseOut () {

  }

  _xcenter = ({ position }) => {
    return this._projection(position)[0]
  }

  _ycenter = ({ position }) => {
    return this._projection(position)[1]
  }

  _radius ({ livecam }) {
    return `${livecam ? 3 : 1.5}px`
  }

  _class ({ livecam }) {
    return `${livecam ? 'livecam' : ''} measurement`
  }

  render () {
    const points = d3.select(this.element).select(this.group)
    const dataset = this.data.toJSON()

    points.selectAll('*').remove()
    points.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', this._xcenter)
      .attr('cy', this._ycenter)
      .attr('r', this._radius)
      .attr('class', this._class)
      .on('click', d => this._handleClick(d))
      .on('mouseover', d => this._handleMouseOver(d))
      .on('mouseout', d => this._handleMouseOut(d))
  }
}

App.Views.Measurements = Measurements
