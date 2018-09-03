window.BaseModule = class extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
      dataset_id: null, 
    };
  }

  app() {
    return this.props.app;
  }

  // datasets() {
  //   return this.app().state.datasets;
  // }

  datasets() {
    var selecteds = {};
    this.app().selected_dataset_ids().forEach((id) => {
      selecteds[id] = this.app().state.datasets[id];
    });

    return selecteds;
  }

  dataset() {
    return this.state.dataset_id ? this.datasets()[this.state.dataset_id] : null;
  }
}



window.ReactCodeMirror = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    if (this.props.el) this.props.beforeMount(this);
  }

  componentDidMount() {
    this.editor = CodeMirror.fromTextArea($(this.el)[0], {
      'mode': 'r',
      'lineNumbers': true,
      'lineSeparator': '\n', 
      'indentUnit': 2,
      'readOnly': true,
      'scrollbarStyle': 'overlay'
    });
  }

  clear() {
    this.editor.getDoc().setValue('');
  }

  value(text) {
    this.editor.getDoc().setValue(text);
  }

  append(text) {
    var val = (this.editor.getDoc().getValue() ? this.editor.getDoc().getValue() + '\n' : '') + text;
    this.editor.getDoc().setValue(val);
  }

  render() {
    return React.createElement('textarea', {
      ref: (el) => this.el = el, 
    });
  }
}

