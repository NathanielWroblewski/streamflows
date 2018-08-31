class Basins extends App.Views.Projection {
  render () {
    const basins = d3.select(this.element).select(this.group)

    basins.selectAll('*').remove()
    basins.selectAll('path')
      .data(this.data.features)
      .enter()
      .append('path')
      .attr('d', this._path)
      .attr('class', 'basin')
  }
}


App.Views.Basins = Basins
