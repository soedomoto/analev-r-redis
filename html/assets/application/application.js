class DataSelectorApp extends React.Component {
  constructor(props) {
    super(props);

    this.selector_modal__show = this.selector_modal__show.bind(this);

    this.state = {
      dataset_initialized: false, 
      datasets: {}, 
      selector_modal__is_shown: false, 
    };
  }

  initializing() {
    console.log('initializing')
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
      React.createElement('h3', {}, 'Dataset'), 
      React.createElement(DataSelectorApp_SelectedDatasets, {datasets: this.state.datasets}), 
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
              dataset: this.state.datasets[id], 
              index: idx, 
              key: id, 
              on_selected: (_id, _data) => {
                this.state.datasets[_id]['data'] = _data;
                this.forceUpdate();
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
    this.state = {}
  }

  render() {
    return React.createElement('div', { className: 'panel panel-default' }, 
      React.createElement('table', { className: 'table table-bordered' }, 
        React.createElement('tbody', {}, 
          Object.keys(this.props.datasets).map(idx => 
            React.createElement('tr', { key: idx })
          )
        )
      )
    );
  }
}

class DataSelectorApp_Dataset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return React.createElement(ReactBootstrap.ListGroupItem, {
      key: this.props.dataset.id, 
      href: '#', 
      onClick: () => this.dataset__on_selected()
    }, this.props.dataset.label)
  }

  dataset__on_selected() {
    var _self = this;

    analev_call('data.read', [this.props.dataset.id, 'df' + _self.props.index], function(req_id, resp) {
      resp = JSON.parse(resp);
      if (resp.success) {
        if (_self.props.on_selected) _self.props.on_selected(_self.props.dataset.id, Papa.parse(resp.data))
      }
    })
  }
}