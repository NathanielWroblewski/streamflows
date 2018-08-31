!function () {
  const BASINS = '/public/javascripts/datasets/simplified_major_river_basins.topojson'
  const RIVERS = '/public/javascripts/datasets/simplified_rivers.topojson'
  const USGS_API_URL = 'https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=nc&parameterCd=00060,00065,00010&siteType=ES,LK,ST&siteStatus=active'
  const element = document.querySelector('.map > svg')
  const TOTAL_CALLS = 3
  let callsComplete = 0

  const finishLoading = () => {
    if (callsComplete >= TOTAL_CALLS) {
      document.querySelector('.loading').style.display = 'none'
    }
  }

  const handleError = () => {
    const view = new App.Views.ErrorMessage({
      element: document.querySelector('.map')
    })

    callsComplete = TOTAL_CALLS
    finishLoading()
    view.render()
  }

  const tooltip = new App.Views.Tooltip({
    element: document.querySelector('.tooltip'),
    model: new App.Models.Datum({ position: [], })
  })

  // Load and render river basins
  d3.json(BASINS, (error, topofile) => {
    if (error) handleError()

    const group = 'g.basins'
    const data = topojson.feature(topofile, topofile.objects.major_river_basins)
    const view = new App.Views.Basins({ element, group, data })

    callsComplete++
    finishLoading()
    view.render()
  })

  // Load and render rivers and streams
  d3.json(RIVERS, (error, topofile) => {
    if (error) handleError()

    const group = 'g.rivers'
    const data = topojson.feature(topofile, topofile.objects.rivers)
    const view = new App.Views.Rivers({ element, group, data })

    callsComplete++
    finishLoading()
    view.render()
  })

  // Load and render measurements
  d3.json(USGS_API_URL, (error, dataset) => {
    if (error) handleError()

    const group = 'g.points'
    const data = new App.Models.Dataset({ dataset })
    const model = tooltip.model
    const view = new App.Views.Measurements({ element, group, data, model })
    const table = new App.Views.Table({
      element: document.querySelector('.tabular-data'),
      model: data
    })

    model.update(data.toJSON()[0])
    callsComplete++
    finishLoading()
    view.render()
    table.render()
  })
}()
