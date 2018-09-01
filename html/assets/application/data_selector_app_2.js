class DataSelectorApp extends React.Component {
  constructor(props) {
    super(props);

    this.selector_modal__show = this.selector_modal__show.bind(this);

    this.state = {
      dataset_initialized: false, 
      datasets: {}, 
      selector_modal__is_shown: false, 
    };

    if (this.props.self) this.props.self(this);
  }

  initializing() {
    var _this = this;

    analev_call('data.get_catalogues', [], function(req_id, resp) {
      resp = JSON.parse(resp);
      if (resp.success) {
        _this.setState({
          datasets: resp.data.reduce((obj, d) => {
            d.selected = false;
            obj[d.id] = d;
            return obj;
          }, {}), 
          dataset_initialized: true
        });
      }
    });
  }

  render() {
    if (! this.state.dataset_initialized) this.initializing();

    return React.createElement('div', {}, 
      React.createElement(DataSelectorApp_SelectedDatasets, { app: this }), 
      React.createElement('div', { className: 'text-center' }, 
        React.createElement(ReactBootstrap.Button, { 
          bsStyle: 'primary', 
          onClick: () => this.selector_modal__show()
        }, 'Select Data')
      ), 
      this.selector_modal__render()
    );
  }

  // Modal

  selector_modal__render() {
    return React.createElement(ReactBootstrap.Modal, {
      show: this.state.selector_modal__is_shown, 
      onHide: () => this.selector_modal__hide(), 
      onEntering: () => this.selector_modal__on_entering()
    }, 
      React.createElement(ReactBootstrap.Modal.Header, { closeButton: true }, 
        React.createElement(ReactBootstrap.Modal.Title, {}, 'Select Dataset')
      ), 
      React.createElement(ReactBootstrap.Modal.Body, {}, 
        React.createElement(ReactBootstrap.ListGroup, {}, 
          Object.keys(this.state.datasets).map((id, idx) => 
            React.createElement(DataSelectorApp_Dataset, { 
              app: this, 
              id: id, 
              key: id, 
              on_selected: (_id, _data) => {
                this.state.datasets[_id].variables = _data.data[0];
                this.state.datasets[_id].preview = _data.data;
                this.state.datasets[_id].selected = true;
                
                this.forceUpdate();
                this.selector_modal__hide();
              }
            })
          )
        )
      ), 
      React.createElement(ReactBootstrap.Modal.Footer, {}, 
        React.createElement(ReactBootstrap.Button, {
          onClick: () => this.selector_modal__hide()
        }, 'Close')
      )
    );
  }

  selector_modal__show() {
    this.setState({ selector_modal__is_shown: true });
  }

  selector_modal__hide() {
    this.setState({ selector_modal__is_shown: false });
  }

  selector_modal__on_entering() {}
}

class DataSelectorApp_SelectedDatasets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      preview_app: null, 
      visualization_app: null, 
    }
  }

  render() {
    var selected_datasets = [];

    Object.keys(this.props.app.state.datasets).forEach(id => {
      if (this.props.app.state.datasets[id].selected) {
        selected_datasets.push(id);
      }
    })

    return React.createElement('div', { className: 'panel panel-default' }, 
      React.createElement('table', { className: 'table table-bordered' }, 
        React.createElement('tbody', {}, 
          selected_datasets.map(id => 
            React.createElement(DataSelectorApp_SelectedDataset, {
              key: id, 
              id: id, 
              app: this.props.app, 
              show_preview: (selected_id) => {
                this.state.preview_app.setState({
                  show: true, 
                  id: selected_id
                })
              }, 
              show_visualization: (selected_id) => {
                this.state.visualization_app.setState({
                  show: true, 
                  id: selected_id
                })
              }
            })
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

class DataSelectorApp_SelectedDataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  dataset() {
    return this.props.app.state.datasets[this.props.id];
  }

  render() {
    return React.createElement('tr', {}, 
      React.createElement('td', {}, 'df' + this.dataset().idx), 
      React.createElement('td', {}, this.dataset().label), 
      React.createElement('td', {}, 
        React.createElement(ReactBootstrap.Button, {}, 'Remove'), 
        React.createElement(ReactBootstrap.Button, { onClick: () => {
          if(this.props.show_preview) this.props.show_preview(this.props.id);
        } }, 'Preview'), 
        React.createElement(ReactBootstrap.Button, { onClick: () => {
          if(this.props.show_visualization) this.props.show_visualization(this.props.id);
        } }, 'Visualize')
      )
    );
  }
}

class DataSelectorApp_Dataset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  dataset() {
    return this.props.app.state.datasets[this.props.id];
  }

  generate_index() {
    if (! ('idx' in this.props.app.state.datasets[this.props.id])) {
      var idxs = [], 
        n_ds = 0;

      Object.values(this.props.app.state.datasets).forEach(d => {
        if ('idx' in d) idxs.push(d.idx);
        n_ds += 1;
      });

      for(var i=0; i<n_ds; i++) {
        if (! (i in idxs)) {
          this.props.app.state.datasets[this.props.id].idx = i;
          break;
        }
      }
    }
  }

  render() {
    return React.createElement(ReactBootstrap.ListGroupItem, {
      href: '#', 
      onClick: () => this.dataset__on_selected()
    }, this.dataset().label)
  }

  dataset__on_selected() {
    var _self = this;

    this.generate_index();

    analev_call('data.read', [_self.dataset().id, 'df' + _self.dataset().idx], function(req_id, resp) {
      resp = JSON.parse(resp);
      if (resp.success) {
        if (_self.props.on_selected) _self.props.on_selected(_self.props.id, Papa.parse(resp.data))
      }
    })
  }
}