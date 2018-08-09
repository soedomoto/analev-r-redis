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
      React.createElement(DataSelectorApp_SelectedDatasets, { selector_app: this }), 
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
              selector_app: this, 
              id: id, 
              key: id, 
              on_selected: (_id, _data) => {
                this.state.datasets[_id].idx = idx;
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
      preview_shown: false, 
      preview_dataset_id: null, 

      visualization_shown: false, 
      visualization_dataset_id: null, 
    }
  }

  preview_dataset() {
    return this.props.selector_app.state.datasets[this.state.preview_dataset_id];
  }

  render_preview_modal() {
    return React.createElement(ReactBootstrap.Modal, {
      show: this.state.preview_shown, 
      onHide: () => this.setState({ preview_shown: false }), 
      onEntering: () => {}
    }, 
      React.createElement(ReactBootstrap.Modal.Header, { closeButton: true }, 
        React.createElement(ReactBootstrap.Modal.Title, {}, 
          'Preview Dataset ' + (this.state.preview_dataset_id ? this.preview_dataset().label : '')
        )
      ), 
      React.createElement(ReactBootstrap.Modal.Body, {}, 
        React.createElement(ReactBootstrap.Table, { responsive: true }, 
          React.createElement('thead', {}, 
            (this.state.preview_dataset_id ? React.createElement('tr', {}, 
              this.preview_dataset().preview[0].map(c => React.createElement('th', {}, c))
            ) : null)
          ), 
          React.createElement('tbody', {}, 
            (this.state.preview_dataset_id ? this.preview_dataset().preview.slice(1).map(r => React.createElement('tr', {}, 
                r.map(c => React.createElement('td', {}, c))
              )) : null)
          )
        )
      ), 
      React.createElement(ReactBootstrap.Modal.Footer, {}, 
        React.createElement(ReactBootstrap.Button, {
          onClick: () => this.setState({ preview_shown: false })
        }, 'Close')
      )
    );
  }

  visualization_dataset() {
    return this.props.selector_app.state.datasets[this.state.visualization_dataset_id];
  }

  render_visualization_modal() {
    return React.createElement(ReactBootstrap.Modal, {
      show: this.state.visualization_shown, 
      onHide: () => this.setState({ visualization_shown: false }), 
      onEntering: () => {}
    }, 
      React.createElement(ReactBootstrap.Modal.Header, { closeButton: true }, 
        React.createElement(ReactBootstrap.Modal.Title, {}, 
          'Visualize Dataset ' + (this.state.visualization_dataset_id ? this.visualization_dataset().label : '')
        )
      ), 
      React.createElement(ReactBootstrap.Modal.Body, {}, 
        React.createElement(DataSelectorApp_PreviewDataset, { id: this.state.visualization_dataset_id, selector_app: this.props.selector_app })
      ), 
      React.createElement(ReactBootstrap.Modal.Footer, {}, 
        React.createElement(ReactBootstrap.Button, {
          onClick: () => this.setState({ visualization_shown: false })
        }, 'Close')
      )
    );
  }

  render() {
    var selected_datasets = [];

    Object.keys(this.props.selector_app.state.datasets).forEach(id => {
      if (this.props.selector_app.state.datasets[id].selected) {
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
              selector_app: this.props.selector_app, 
              show_preview: (selected_id) => {
                this.setState({
                  preview_shown: true, 
                  preview_dataset_id: selected_id
                });
              }, 
              show_visualization: (selected_id) => {
                this.setState({
                  visualization_shown: true, 
                  visualization_dataset_id: selected_id
                });
              }
            })
          )
        )
      ), 

      this.render_preview_modal(), 
      this.render_visualization_modal()
    );
  }
}

class DataSelectorApp_PreviewDataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x_var: null, 
      y_var: null, 
      visualization_base64_image: null, 
    }
  }

  dataset() {
    return this.props.selector_app.state.datasets[this.props.id]
  }

  generate_plot() {
    var _this = this, 
      cmd = 
        '{0}'

        .format(
          'df' + this.dataset().idx, 
          this.state.x_var
        )

        // 'tmp <- {0} %>%\n' + 
        //   'group_by_at(.vars = {1}) %>%\n' + 
        //   'select_at(.vars = {2}) %>%\n' + 
        //   'na.omit() %>%\n' + 
        //   'summarise_all(fun)\n'
        //   .format(
        //     'df' + this.dataset().idx, 
        //     this.state.x_var, 
        //     this.state.y_var
        //   );

    console.log(cmd)

    analev_eval(cmd, function(req_id, resp) {
      resp = JSON.parse(resp);
      if (resp.success) {
        console.log(resp.data)

        if (resp.data.type == 'image') {
          _this.setState({ visualization_base64_image: resp.data.text })
        }
      } else {
        console.log(resp.data)
      }
    })
  }

  render() {
    return React.createElement('div', { className: 'row' }, 
      React.createElement('div', { className: 'col-lg-4 col-md-4 col-sm-12 col-xs-12' }, 
        React.createElement(ReactBootstrap.FormGroup, {}, 
          React.createElement(ReactBootstrap.ControlLabel, {}, 'Plot Type'), 
          React.createElement('select', { className: 'form-control' }, 
            React.createElement('option', { value: '' }, 'None'), 
            React.createElement('option', { value: 'bar' }, 'Bar'), 
            React.createElement('option', { value: 'line' }, 'Line')
          ), 
          React.createElement(ReactBootstrap.HelpBlock, {}, 'Select plot type')
        ), 
        React.createElement(ReactBootstrap.FormGroup, {}, 
          React.createElement(ReactBootstrap.ControlLabel, {}, 'X Variable'), 
          React.createElement('select', { className: 'form-control', onChange: (ev) => this.state.x_var = ev.target.value }, 
            React.createElement('option', { value: '' }, 'None'), 
            this.dataset().variables.map((v, idx) => React.createElement('option', { key: idx, value: v }, v))
          ), 
          React.createElement(ReactBootstrap.HelpBlock, {}, 'Select X variable')
        ), 
        React.createElement(ReactBootstrap.FormGroup, {}, 
          React.createElement(ReactBootstrap.ControlLabel, {}, 'Y Variable'), 
          React.createElement('select', { className: 'form-control', onChange: (ev) => this.state.y_var = ev.target.value }, 
            React.createElement('option', { value: '' }, 'None'), 
            this.dataset().variables.map((v, idx) => React.createElement('option', { key: idx, value: v }, v))
          ), 
          React.createElement(ReactBootstrap.HelpBlock, {}, 'Select Y variable')
        ), 
        React.createElement(ReactBootstrap.FormGroup, {}, 
          React.createElement(ReactBootstrap.Button, { className: 'form-control', onClick: () => this.generate_plot() }, 'Generate Plot')
        )
      ), 
      React.createElement('div', { className: 'col-lg-8 col-md-8 col-sm-12 col-xs-12' }, 
        (this.state.visualization_base64_image ? React.createElement('img', { 
          style: { width: '100%' }, 
          src: 'data:image/png;base64,' + this.state.visualization_base64_image 
        }) : null)
      )
    );
  }
}

class DataSelectorApp_SelectedDataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  dataset() {
    return this.props.selector_app.state.datasets[this.props.id];
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
    return this.props.selector_app.state.datasets[this.props.id];
  }

  render() {
    return React.createElement(ReactBootstrap.ListGroupItem, {
      href: '#', 
      onClick: () => this.dataset__on_selected()
    }, this.dataset().label)
  }

  dataset__on_selected() {
    var _self = this;

    analev_call('data.read', [_self.dataset().id, 'df' + _self.state.variable_idx], function(req_id, resp) {
      resp = JSON.parse(resp);
      if (resp.success) {
        if (_self.props.on_selected) _self.props.on_selected(_self.props.id, Papa.parse(resp.data))
      }
    })
  }
}