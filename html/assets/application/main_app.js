class MainApp extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
        datasets: {}, 
        dataset_initialized: false, 
        dataset_selector_app: null, 

        modules: {}, 
        module_initialized: false, 
        module_selector_app: null, 
    };
  }

  componentDidUpdate(props, state) {
    this.save_session(state);
  }

  save_session(state) {
    if (state.dataset_initialized) {
      var s_datasets = {}, 
        saved_data = {};

      Object.values(state.datasets).forEach(d => {
        if (d.selected) {
          s_datasets[d.idx] = d.id;
        }
      });

      saved_data['dataset'] = s_datasets;

      analev_call('session.save', [JSON.stringify(saved_data)], function(req_id, resp) {
        resp = JSON.parse(resp);
        if (resp.success) {
          console.log('Changes saved')
        }
      });
    }
  }

  load_session() {
    var _this = this;

    analev_call('session.read', [], function(req_id, resp) {
      resp = JSON.parse(resp);
      if (resp.success && resp.data != "") {
        _this.saved_data = JSON.parse(resp.data);

        Object.keys(_this.saved_data.dataset).forEach(idx => {
          if (_this.state.datasets[_this.saved_data.dataset[idx]]) {
            _this.state.datasets[_this.saved_data.dataset[idx]].idx = parseInt(idx);
            _this.state.datasets[_this.saved_data.dataset[idx]].selected = true;

            _this.forceUpdate();

            analev_eval('head(df{0})'.format(parseInt(idx)), function(req_id, resp, req_url, resp_url) {
              resp = JSON.parse(resp);
              if (resp.success) {
                if (resp.data.type == 'table') {
                  var matches = /head\(df([^)]+)\)/.exec(req_url);
                  if (matches) {
                    var idx = matches[1];

                    var data = Papa.parse(resp.data.text);
                    _this.state.datasets[_this.saved_data.dataset[idx]].variables = data.data[0];
                    _this.state.datasets[_this.saved_data.dataset[idx]].preview = data.data;

                    _this.forceUpdate();
                  }
                }
              }
            });     
          }
        });
      }
    });
  }

  init_dataset() {
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

        _this.load_session();
      }
    });
  }

  init_module() {
    var _this = this;

    analev_call('module.all', [], function(req_id, resp) {
      resp = JSON.parse(resp);
      if (resp.success) {
        _this.setState({
          modules: resp.data.reduce((obj, d) => {
            d.selected = false;
            obj[d.id] = d;
            return obj;
          }, {}), 
          module_initialized: true
        });

        _this.load_session();
      }
    });
  }

  selected_dataset_ids() {
    var selected_datasets = [];

    Object.keys(this.state.datasets).forEach(id => {
      if (this.state.datasets[id].selected) {
        selected_datasets.push(id);
      }
    });

    return selected_datasets;
  }

  render() {
    if (! this.state.dataset_initialized) this.init_dataset();
    if (! this.state.module_initialized) this.init_module();

  	return React.createElement('div', { className: 'row' }, 
  		// Data selector panel
			React.createElement('div', { className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12' }, 
				React.createElement('div', { className: 'card alert' }, 
					React.createElement('div', { className: 'card-header' }, 
						React.createElement('h4', {}, 'Datasets')
					), 
					React.createElement('div', { className: 'card-body' }, 
						React.createElement(DatasetWidgetApp, {
                app: this, 
                self: (app) => this.state.dataset_selector_app = app
            })
					)
				)
			), 

      // Module selector panel
      React.createElement('div', { className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12' }, 
        React.createElement('div', { className: 'card alert' }, 
          React.createElement('div', { className: 'card-header' }, 
            React.createElement('h4', {}, 'Modules')
          ), 
          React.createElement('div', { className: 'card-body' }, 
            React.createElement(ModuleWidgetApp, {
                app: this, 
                self: (app) => this.state.module_selector_app = app
            })
          )
        )
      ), 

			// Main panel
			React.createElement('div', { className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12' }, 
				React.createElement('div', { className: 'card alert' }, 
					React.createElement('div', { className: 'card-header' }, 
						React.createElement('h4', {}, 'Result')
					), 
					React.createElement('div', { className: 'card-body' }, 'Result Body')
				)
			)
		)
  }
}