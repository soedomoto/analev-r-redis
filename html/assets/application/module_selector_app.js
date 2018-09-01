class ModuleWidgetApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal_selector_app: null, 
      selected_module_app: null, 
    }

    if (this.props.self) this.props.self(this);
  }

  app() {
    return this.props.app;
  }

  render() {
    return React.createElement('div', {}, 
      // React.createElement(DatasetWidgetApp_Selectedmodules, { app: this }), 
      
      React.createElement(SelectedModuleWidgetApp, {
        app: this.app(), 
        self: (app) => this.state.selected_module_app = app
      }), 

      React.createElement('div', { className: 'text-center' }, 
        React.createElement(ReactBootstrap.Button, { 
          bsStyle: 'primary', 
          onClick: () => this.state.modal_selector_app.setState({ show: true })
        }, 'Select Module')
      ), 
      
      React.createElement(ModuleSelectorApp, {
        app: this.app(), 
        self: (app) => this.state.modal_selector_app = app
      }), 
    );
  }
}

class SelectedModuleWidgetApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

  selected_modules() {
    var selected_modules = [];

    Object.keys(this.modules()).forEach(id => {
      if (this.modules()[id].selected) {
        selected_modules.push(id);
      }
    });

    return selected_modules;
  }

  remove_module(id) {
    var _self = this;
    
    _self.unload_script(id);
    _self.modules()[id].selected = false;         
    _self.app().forceUpdate();  
  } 

  unload_script(id) {
    var elem = document.getElementById('module_' + id), 
      clazz = this.modules()[id].name;

    delete window[clazz];

    if(elem) {
      elem.parentNode.removeChild(elem);
      console.log('module_' + this.modules()[id].label + ' is unloaded')
    } else {
      console.log('module_' + this.modules()[id].label + ' is failed to unload')
    }
  }

  render() {
    return React.createElement('div', { className: 'panel panel-default' }, 
      React.createElement('table', { className: 'table table-bordered' }, 
        React.createElement('tbody', {}, 
          this.selected_modules().map(id => 
            React.createElement('tr', { key: id }, 
              React.createElement('td', {}, this.modules()[id].label), 
              React.createElement('td', {}, 
                React.createElement(ReactBootstrap.Button, {
                  onClick: () => {
                    this.state.module_app.setState({ show: true, id: id });
                  }
                }, 'Open'), 
                React.createElement(ReactBootstrap.Button, {
                  onClick: () => {
                    this.remove_module(id)
                  }
                }, 'Remove'), 
              )
            )
          )
        )
      ), 

      React.createElement(OpenModuleApp, { 
        app: this.props.app, 
        self: (app) => this.state.module_app = app
      }), 
    );
  }
}

class ModuleSelectorApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

  load_script(id) {
    var text = this.modules()[id].src, 
      clazz = this.modules()[id].name;

    if (typeof window[clazz] != 'undefined') {
      console.log('module "' + this.modules()[id].label + '" has been already loaded')
    } else {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.text = text;
      script.id = 'module_' + id;

      document.body.appendChild(script);

      if (typeof window[clazz] != 'undefined') {
        this.setState({ show: false });
        this.app().forceUpdate();

        console.log('module "' + this.modules()[id].label + '" is loaded');
      }
    }
  };

  select_module(id) {
    // if (! ('src' in this.modules()[id])) {
      analev_call('module.read', [id], (req_id, resp) => {
        resp = JSON.parse(resp);
        if (resp.success) {
          this.modules()[id].selected = true;   
          this.modules()[id].src = resp.data;
          this.load_script(id);
        }
      });
    // } else {
    //   this.modules()[id].selected = true;    
    //   this.load_script(id);
    // }
  }

  render() {
    return React.createElement(ReactBootstrap.Modal, {
      show: this.state.show, 
      onHide: () => this.setState({ show: false }), 
      onEntering: () => {}
    }, 
      React.createElement(ReactBootstrap.Modal.Header, { closeButton: true }, 
        React.createElement(ReactBootstrap.Modal.Title, {}, 'Select Module')
      ), 
      React.createElement(ReactBootstrap.Modal.Body, {}, 
        React.createElement(ReactBootstrap.ListGroup, {}, 
          (this.app() ? 
            Object.keys(this.app().state.modules).map((id) => 
              React.createElement(ReactBootstrap.ListGroupItem, {
                key: id, 
                href: '#', 
                onClick: () => {
                  this.select_module(id);
                }
              }, this.app().state.modules[id].label)
            ) : null
          )
        )
      ), 
      React.createElement(ReactBootstrap.Modal.Footer, {}, 
        React.createElement(ReactBootstrap.Button, {
          onClick: () => this.setState({ show: false })
        }, 'Close')
      )
    );
  }
}