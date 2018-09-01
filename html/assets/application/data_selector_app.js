class DatasetWidgetApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal_selector_app: null, 
      selected_dataset_app: null, 
    }

    if (this.props.self) this.props.self(this);
  }

  app() {
    return this.props.app;
  }

  render() {
    return React.createElement('div', {}, 
      // React.createElement(DatasetWidgetApp_SelectedDatasets, { app: this }), 
      
      React.createElement(SelectedDatasetWidgetApp, {
        app: this.app(), 
        self: (app) => this.state.selected_dataset_app = app
      }), 

      React.createElement('div', { className: 'text-center' }, 
        React.createElement(ReactBootstrap.Button, { 
          bsStyle: 'primary', 
          onClick: () => this.state.modal_selector_app.setState({ show: true })
        }, 'Select Data')
      ), 
      
      React.createElement(DatasetSelectorApp, {
        app: this.app(), 
        self: (app) => this.state.modal_selector_app = app
      }), 
    );
  }
}

class SelectedDatasetWidgetApp extends React.Component {
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

  datasets() {
    return this.app().state.datasets;
  }

  selected_datasets() {
    var selected_datasets = [];

    Object.keys(this.datasets()).forEach(id => {
      if (this.datasets()[id].selected) {
        selected_datasets.push(id);
      }
    });

    return selected_datasets;
  }

  remove_dataset(id) {
    var _self = this, 
      cmd = 'remove(df{0})'.format(this.datasets()[id].idx);
    
    analev_eval(cmd, function(req_id, resp) {
      resp = JSON.parse(resp);
      if (resp.success) {
        delete _self.datasets()[id].variables; 
        delete _self.datasets()[id].preview; 
        _self.datasets()[id].selected = false; 
        
        _self.app().forceUpdate();
      } else {
        console.log(resp.data)
      }
    });
  }

  render() {
    return React.createElement('div', { className: 'panel panel-default' }, 
      React.createElement('table', { className: 'table table-bordered' }, 
        React.createElement('tbody', {}, 
          this.selected_datasets().map(id => 
            React.createElement('tr', { key: id }, 
              React.createElement('td', {}, 'df' + this.datasets()[id].idx), 
              React.createElement('td', {}, this.datasets()[id].label), 
              React.createElement('td', {}, 
                React.createElement(ReactBootstrap.Button, {
                  onClick: () => {
                    this.state.preview_app.setState({
                      show: true, 
                      id: id
                    })
                  }
                }, 'Preview'), 
                React.createElement(ReactBootstrap.Button, {
                  onClick: () => {
                    this.state.visualization_app.setState({
                      show: true, 
                      id: id
                    })
                  }
                }, 'Visualize'), 
                React.createElement(ReactBootstrap.Button, {
                  onClick: () => {
                    this.remove_dataset(id)
                  }
                }, 'Remove'), 
              )
            )
          )
        )
      ), 

      React.createElement(PreviewApp, { 
        app: this.props.app, 
        self: (app) => this.state.preview_app = app
      }), 
      
      React.createElement(VisualizationApp, { 
        app: this.props.app, 
        self: (app) => this.state.visualization_app = app
      }), 
    );
  }
}

class DatasetSelectorApp extends React.Component {
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

  datasets() {
    return this.app().state.datasets;
  }

  generate_index(id) {
    if (! ('idx' in this.datasets()[id])) {
      var idxs = [], 
        n_ds = 0;

      Object.values(this.datasets()).forEach(d => {
        if ('idx' in d) idxs.push(d.idx);
        n_ds += 1;
      });

      for(var i=0; i<n_ds; i++) {
        if (! (i in idxs)) {
          this.datasets()[id].idx = i;
          break;
        }
      }
    }
  }

  select_dataset(id) {
    var _self = this;

    this.generate_index(id);
    analev_call('data.read', [_self.datasets()[id].id, 'df' + _self.datasets()[id].idx], function(req_id, resp) {
      resp = JSON.parse(resp);
      if (resp.success) {
        var data = Papa.parse(resp.data);
        _self.datasets()[id].variables = data.data[0];
        _self.datasets()[id].preview = data.data;
        _self.datasets()[id].selected = true;
        
        _self.setState({ show: false });
        _self.app().forceUpdate();
      }
    })
  }

  render() {
    return React.createElement(ReactBootstrap.Modal, {
      show: this.state.show, 
      onHide: () => this.setState({ show: false }), 
      onEntering: () => {}
    }, 
      React.createElement(ReactBootstrap.Modal.Header, { closeButton: true }, 
        React.createElement(ReactBootstrap.Modal.Title, {}, 'Select Dataset')
      ), 
      React.createElement(ReactBootstrap.Modal.Body, {}, 
        React.createElement(ReactBootstrap.ListGroup, {}, 
          (this.app() ? 
            Object.keys(this.app().state.datasets).map((id) => 
              React.createElement(ReactBootstrap.ListGroupItem, {
                key: id, 
                href: '#', 
                onClick: () => {
                  this.select_dataset(id);
                }
              }, this.app().state.datasets[id].label)
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