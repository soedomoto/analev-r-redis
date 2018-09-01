class BaseAnalevApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null, 
      show: false,
    }

    if (this.props.self) this.props.self(this);
  }

  dataset() {
    return this.state.id ? this.props.app.state.datasets[this.state.id] : null;
  }

  df() {
    return this.dataset() ? 'df' + this.dataset().idx : null;
  }

  render() {}
}