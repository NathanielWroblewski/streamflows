namespace('App.Views')

class ErrorMessage {
  constructor ({ element }) {
    this.element = element
  }

  template () {
    return `
      <div class="load-error">
        <p class="text">
          We are currently unable to fetch measurements from USGS.
        </p>
      </div>
    `
  }

  render () {
    this.element.innerHTML = this.template()
  }
}


App.Views.ErrorMessage = ErrorMessage
