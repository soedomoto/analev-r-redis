class PreviewApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null, 
      show: false,
    }

    if (this.props.self) this.props.self(this);
  }

  dataset() {
    return this.state.id ? this.props.app.state.datasets[this.state.id] : null;
  }

  df() {
    return this.dataset() ? 'df' + this.dataset().idx : null;
  }

  render() {
    return React.createElement(ReactBootstrap.Modal, {
      show: this.state.show, 
      onHide: () => this.setState({ id: null, show: false }), 
      onEntering: () => {}
    }, 
      React.createElement(ReactBootstrap.Modal.Header, { closeButton: true }, 
        React.createElement(ReactBootstrap.Modal.Title, {}, 
          'Preview Dataset ' + (this.dataset() ? this.dataset().label : '')
        )
      ), 
      React.createElement(ReactBootstrap.Modal.Body, {}, 
        React.createElement(ReactBootstrap.Table, { responsive: true }, 
          React.createElement('thead', {}, 
            (this.dataset() ? 
              React.createElement('tr', {}, 
                this.dataset().preview ? this.dataset().preview[0].map((c, idx) => React.createElement('th', { key: idx }, c)) : null
              ) : null
            )
          ), 
          React.createElement('tbody', {}, 
            (this.dataset() ? 
              (this.dataset().preview ? 
                this.dataset().preview.slice(1).map((r, r_idx) => 
                  React.createElement('tr', { key: r_idx }, 
                    r.map((c, c_idx) => React.createElement('td', { key: c_idx }, c))
                  )
                ) : null
              ) : null
            )
          )
        )
      ), 
      React.createElement(ReactBootstrap.Modal.Footer, {}, 
        React.createElement(ReactBootstrap.Button, {
          onClick: () => this.setState({ id: null, show: false })
        }, 'Close')
      )
    );
  }
}