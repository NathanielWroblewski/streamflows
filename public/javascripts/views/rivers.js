class Rivers extends App.Views.Projection {
  render () {
    const rivers = d3.select(this.element).select(this.group)

    rivers.selectAll('*').remove()
    rivers.selectAll('path')
      .data(this.data.features)
      .enter()
      .append('path')
      .attr('d', this._path)
      .attr('class', 'river')
  }
}

App.Views.Rivers = Rivers
