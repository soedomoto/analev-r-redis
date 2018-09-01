class OpenModuleApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null, 
      show: false,
    }

    if (this.props.self) this.props.self(this);
  }

  app() {
    return this.props.app;
  }

  modules() {
    return this.app().state.modules;
  }

  module() {
    return this.state.id ? this.modules()[this.state.id] : null;
  }

  render() {
    return React.createElement(ReactBootstrap.Modal, {
      bsSize: 'large', 
      show: this.state.show, 
      onHide: () => this.setState({ id: null, show: false }), 
      onEntering: () => {}
    }, 
      React.createElement(ReactBootstrap.Modal.Header, { closeButton: true }, 
        React.createElement(ReactBootstrap.Modal.Title, {}, 
          (this.module() ? this.module().label : '')
        )
      ), 
      React.createElement(ReactBootstrap.Modal.Body, {}, 
        (this.module() ? React.createElement(eval(this.module().name), {
          app: this.app(), 
          // self: (app) => this.state['module_' + this.module().id] = app
        }) : null)
      ), 
      React.createElement(ReactBootstrap.Modal.Footer, {}, 
        React.createElement(ReactBootstrap.Button, {
          onClick: () => this.setState({ id: null, show: false })
        }, 'Close')
      )
    );
  }
}