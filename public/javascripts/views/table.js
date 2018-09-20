namespace('App.Views')

const COLUMNS = [
  {
    key: 'station',
    label: 'Station',
    render: ({ station }) => station.toLowerCase().replace(', nc', '')
  },
  {
    key: 'height',
    label: 'Height (ft)',
    render: ({ height }) => height.value || '&nbsp;'
  },
  {
    key: 'flow',
    label: 'Flow (cfs)',
    render: ({ flow }) => flow.value || '&nbsp;'
  },
  {
    key: 'temp',
    label: 'Temp (&deg;C)',
    render: ({ temp }) => temp.value || '&nbsp;'
  },
]

// Array#sort is unstable
const stableSort = (array, compare) => {
  const list = array.map((value, index) => ({ value, index }))

  list.sort((a, b) => {
    const r = compare(a.value, b.value)

    return r == 0 ? a.index - b.index : r
  })

  return list.map(element => element.value)
}

const ASC = 1;
const DESC = -1;

const COMPARATORS = {
  station: (a, b) => (
    a.station.localeCompare(b.station, 'en', {
      ignorePunctuation: true,
      caseFirst: 'false',
      numeric: false,
      sensitivity: 'variant',
      usage: 'sort'
    })
  ),
  height: (a, b) => {
    const _a = parseFloat(a.height.value) || 0
    const _b = parseFloat(b.height.value) || 0

    if (_a === _b) return 0

    return _a > _b ? 1 : -1
  },
  flow: (a, b) => {
    const _a = parseFloat(a.flow.value) || 0
    const _b = parseFloat(b.flow.value) || 0

    if (_a === _b) return 0

    return _a > _b ? 1 : -1
  },
  temp: (a, b) => {
    const _a = parseFloat(a.temp.value) || 0
    const _b = parseFloat(b.temp.value) || 0

    if (_a === _b) return 0

    return _a > _b ? 1 : -1
  }
};

class Table {
  constructor ({ element, model }) {
    this.element = element
    this.model = model

    this.state = {
      orderBy: 'station',
      order: ASC,
    }
  }

  _removeListeners () {
    const getListeners = window.getEventListeners

    COLUMNS.map(({ key }, index) => {
      const column = this.element.querySelector(`th:nth-of-type(${index + 1})`)

      if (column) {
        column.removeEventListener('click', this._listeners[index], false)
      }
    })
  }

  _setListeners () {
    this._listeners = []

    COLUMNS.forEach(({ key }, index) => {
      const column = this.element.querySelector(`th:nth-of-type(${index + 1})`)
      const handler = () => this._sortBy(key)

      column.addEventListener('click', handler)
      this._listeners.push(handler)
    })
  }

  _sortBy (orderBy) {
    const invertOrder = orderBy === this.state.orderBy
    const order = invertOrder ? this.state.order * -1 : DESC

    this.state = { orderBy, order }
    this.render()
  }

  template (data = []) {
    const sortedData = stableSort(data, (a, b) => (
      COMPARATORS[this.state.orderBy](a, b) * this.state.order
    ))
    const activeColumn = this.state.orderBy
    const order = this.state.order === ASC ? 'asc' : 'desc';

    return `
      <table>
        <thead>
          <tr>
            ${COLUMNS.reduce((html, { key, label }) => (
              html += `
                <th class="${activeColumn === key ? order : ''}">
                  ${label}
                </th>
              `
            ), '')}
          </tr>
        </thead>
        <tbody>
          ${sortedData.reduce((html, datum) => (
            html += `
              <tr>
                ${COLUMNS.reduce((row, column) => (
                  row += `<td>${column.render(datum)}</td>`
                ), '')}
              </tr>
            `
          ), '')}
        </tbody>
      </table>
    `
  }

  render () {
    this._removeListeners()
    this.element.innerHTML = this.template(this.model.toJSON())
    this._setListeners()

    return this
  }
}

App.Views.Table = Table
