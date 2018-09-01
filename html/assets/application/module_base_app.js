class BaseModule extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
      dataset_id: null, 
    };
  }

  app() {
    return this.props.app;
  }

  datasets() {
    return this.app().state.datasets;
  }

  selected_datasets() {
    return this.app().selected_dataset_ids().map(id => this.datasets()[id]);
  }

  dataset() {
    return this.state.dataset_id ? this.datasets()[this.state.dataset_id] : null;
  }
}

class ReactCodeMirror extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

class BootstrapSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var _self = this;
    _self.$el = $(this.el);

    _self.$el
      .on('loaded.bs.select', function (e) {
        var cont = $(e.target).parents().filter(function() {
          if ($(this).hasClass('bootstrap-select')) return true;
          return false;
        });

        $(cont).addClass('form-control');
        $(cont).find('button').addClass('form-control').removeClass('btn-default');
      })
      .on('changed.bs.select', e => this.props.onChange(e, $(e.target).val()));

    _self.$el.selectpicker(this.props);
  }

  render() {
    return React.createElement('select', { ref: el => this.el = el, multiple: (this.props.multiple || false) }, 
      this.props.options.map((v, idx) => React.createElement('option', { key: idx, value: v }, v))
    );
  }
}