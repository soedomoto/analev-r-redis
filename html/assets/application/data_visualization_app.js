class VisualizationApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null, 
      show: false, 
      plot_type: null, 
      x_var: null, 
      y_var: null, 
      sum_funcs: {
        n_obs: 'n_obs', n_missing: 'n_missing', n_distinct: 'n_distinct', mean: 'mean', median: 'median', min: 'min', max: 'max', sum: 'sum', var: 'var', sd: 'sd', se: 'se', cv: 'cv', prop: 'prop', varprop: 'varprop', sdprop: 'sdprop', seprop: 'seprop', varpop: 'varpop', sdpop: 'sdpop', skew: 'skew', kurtosi: 'kurtosis'
      }, 
      sum_func: 'mean', 
      visualization_base64_image: null, 
    }

    if (this.props.self) this.props.self(this);
  }

  dataset() {
    return this.state.id ? this.props.app.state.datasets[this.state.id] : null;
  }

  df() {
    return this.dataset() ? 'df' + this.dataset().idx : null;
  }

  on_close() {
    this.setState({
      id: null, 
      show: false, 
      plot_type: null, 
      x_var: null, 
      y_var: null, 
      sum_func: 'n_obs', 
      visualization_base64_image: null, 
    });
  }

  render() {
    return React.createElement(ReactBootstrap.Modal, {
      show: this.state.show, 
      onHide: () => this.on_close(), 
      onEntering: () => {}
    }, 
      React.createElement(ReactBootstrap.Modal.Header, { closeButton: true }, 
        React.createElement(ReactBootstrap.Modal.Title, {}, 
          'Visualize Dataset ' + (this.state.id ? this.dataset().label : '')
        )
      ), 
      React.createElement(ReactBootstrap.Modal.Body, {}, 
        React.createElement('div', { className: 'row' }, 
          React.createElement('div', { className: 'col-lg-4 col-md-4 col-sm-12 col-xs-12' }, this.render_options()), 
          React.createElement('div', { className: 'col-lg-8 col-md-8 col-sm-12 col-xs-12' }, 
            (this.state.visualization_base64_image ? React.createElement('img', { 
              style: { width: '100%' }, 
              src: 'data:image/png;base64,' + this.state.visualization_base64_image 
            }) : null)
          )
        )
      ), 
      React.createElement(ReactBootstrap.Modal.Footer, {}, 
        React.createElement(ReactBootstrap.Button, {
          onClick: () => this.on_close()
        }, 'Close')
      )
    );
  }

  render_options() {
    return [
      React.createElement(ReactBootstrap.FormGroup, { key: 'i_type' }, 
        React.createElement(ReactBootstrap.ControlLabel, {}, 'Plot Type'), 
        React.createElement('select', {
          className: 'form-control', 
          onChange: (ev) => this.setState({ plot_type: ev.target.value })
        }, 
          React.createElement('option', { value: '' }, 'None'), 
          React.createElement('option', { value: 'bar' }, 'Bar'), 
          React.createElement('option', { value: 'line' }, 'Line')
        ), 
        React.createElement(ReactBootstrap.HelpBlock, {}, 'Select plot type')
      ), 
      React.createElement(ReactBootstrap.FormGroup, { key: 'i_process' }, 
        React.createElement(ReactBootstrap.Button, { className: 'form-control', onClick: () => this.process_plot() }, 'Generate Plot')
      )
    ].concat(this.render_options_by_type());
  }

  render_options_by_type() {
    var elements = [];

    if (!this.dataset() || !this.dataset().variables) return elements;

    if (this.state.plot_type == 'bar') {
      elements.push(
        React.createElement(ReactBootstrap.FormGroup, { key: 'x' }, 
          React.createElement(ReactBootstrap.ControlLabel, {}, 'X Variable'), 
          React.createElement('select', { className: 'form-control', onChange: (ev) => this.state.x_var = ev.target.value }, 
            React.createElement('option', { value: '' }, 'None'), 
            this.dataset().variables.map((v, idx) => React.createElement('option', { key: idx, value: v }, v))
          ), 
          React.createElement(ReactBootstrap.HelpBlock, {}, 'Select X variable')
        ), 
        React.createElement(ReactBootstrap.FormGroup, { key: 'y' }, 
          React.createElement(ReactBootstrap.ControlLabel, {}, 'Y Variable'), 
          React.createElement('select', { className: 'form-control', onChange: (ev) => this.state.y_var = ev.target.value }, 
            React.createElement('option', { value: '' }, 'None'), 
            this.dataset().variables.map((v, idx) => React.createElement('option', { key: idx, value: v }, v))
          ), 
          React.createElement(ReactBootstrap.HelpBlock, {}, 'Select Y variable')
        ), 
        React.createElement(ReactBootstrap.FormGroup, { key: 'fn' }, 
          React.createElement(ReactBootstrap.ControlLabel, {}, 'Apply Function'), 
          React.createElement('select', {
            className: 'form-control', 
            onChange: (ev) => this.setState({ sum_func: ev.target.value })
          }, 
            Object.keys(this.state.sum_funcs).map(v => 
              React.createElement('option', { key: v, value: v }, this.state.sum_funcs[v])
            )
          ), 
          React.createElement(ReactBootstrap.HelpBlock, {}, 'Select function to apply')
        )
      );
    }

    return elements;
  }

  process_plot() {
    var _this = this, 
      cmd = [
        (
          "library(dplyr) \n" + 
          "library(ggplot2) \n\n" + 
          
          "tmp <- {0} %>% \n" + 
            "group_by_at(.vars = '{1}') %>% \n" + 
            "select_at(.vars = '{2}') %>% \n" + 
            "na.omit() %>% \n" + 
            "summarise_all('{3}') \n" + 

          "ggplot(tmp, aes_string(x = '{1}', y = '{2}')) + " + 
          "geom_bar(stat = 'identity', position = 'dodge') + " + 
          "theme(legend.position = 'none')"
        ).format(
          this.df(), 
          this.state.x_var, 
          this.state.y_var, 
          this.state.sum_func
        ), 
      ]

    cmd.forEach(cmd => analev_eval(cmd, function(req_id, resp) {
      resp = JSON.parse(resp);
      if (resp.success) {
        if (resp.data.type == 'image') {
          _this.setState({ visualization_base64_image: resp.data.text })
        }
      } else {
        console.log(resp.data)
      }
    }))
  }
}