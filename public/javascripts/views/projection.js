namespace('App.Views')

const SCALE = 3685.3900843153515
const CENTER = [-79.89079993049515, 35.22307176654238]

class Projection {
  constructor ({ element, group, data }) {
    this.element = element
    this.group = group
    this.data = data

    this.setListeners()
  }

  setListeners () {
    const zoom = d3.behavior.zoom().scaleExtent([1, Infinity]).on('zoom', () => {
      d3.select(this.element).selectAll('g').attr(
        'transform',
        `translate(${d3.event.translate}) scale(${d3.event.scale})`
      ).selectAll('path').style('stroke-width', `${1 / d3.event.scale}px`)
    })

    d3.select(this.element).call(zoom)
  }

  _handleZoom () {

  }

  get _projection () {
    const { width, height } = this.element;

    return window.d3.geo.mercator().scale(SCALE).center(CENTER).translate([
      width.baseVal.value / 2, height.baseVal.value / 2
    ])
  }

  get _path () {
    return window.d3.geo.path().projection(this._projection)
  }
}


App.Views.Projection = Projection
