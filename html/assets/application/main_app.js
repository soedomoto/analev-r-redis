class MainApp extends React.Component {
	constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
  	return React.createElement('div', { className: 'row' }, 
  		// Data selector panel
			React.createElement('div', { className: 'col-lg-12 col-md-12 col-sm-12 col-xs-12' }, 
				React.createElement('div', { className: 'card alert' }, 
					React.createElement('div', { className: 'card-header' }, 
						React.createElement('h4', {}, 'Dataset')
					), 
					React.createElement('div', { className: 'card-body' }, 
						React.createElement(DataSelectorApp, {})
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