class DataSelectorApp extends React.Component {
  constructor(props) {
    super(props);

    this.selector_modal__show = this.selector_modal__show.bind(this);

    this.state = {
      datasets: [], 
      selector_modal__is_shown: false, 
      selector_modal__datasets: []
    };
  }

  render() {
    return React.createElement('div', {}, 
      React.createElement('h3', {}, 'Dataset'), 
      React.createElement(DataSelectorApp_SelectedDatasets, { items: this.state.datasets }), 
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
          this.state.selector_modal__datasets.map(d => 
            React.createElement(DataSelectorApp_Dataset, {
              data: d, 
              on_selected: function(_d) {
                console.log(_d)
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

  selector_modal__on_entering() {
    var datasets = [
      {id: 1, name: 'Asdf'}
    ];

    this.setState({
      selector_modal__datasets: datasets
    });

    // analev_call('data.get_catalogues', [], function(req_id, resp) {

    // })
  }
}

class DataSelectorApp_Dataset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return React.createElement(ReactBootstrap.ListGroupItem, {
      key: 'lg_' + this.props.data.id, 
      href: '#', 
      onClick: () => this.props.on_selected(this)
    }, this.props.data.name)
  }
}

class DataSelectorApp_SelectedDatasets extends React.Component {
  render() {
    return React.createElement('ul', {}, 
      this.props.items.map(item => 
        React.createElement('li', { key: item.id }, item.text)
      )
    );
  }
}