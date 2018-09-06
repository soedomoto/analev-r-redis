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

window.ARButton = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.label || 'Button', 
    };

    if (this.props.onInit) this.props.onInit(this);
  }

  componentWillMount() {
    if (this.props.onBeforeLoad) this.props.onBeforeLoad(this);
  }

  componentDidMount() {
    if (this.props.onAfterLoad) this.props.onAfterLoad(this);
  }

  componentDidUpdate() {
    if (this.props.onAfterLoad) this.props.onAfterLoad(this);
  }

  label(label) {
    this.setState({
      label: label
    });
  }

  label() {
    return this.state.label;
  }

  render() {
    return React.createElement(ReactBootstrap.Button, { className: 'form-control', 
      onClick: () => {
        if(this.props.onClick) this.props.onClick();
      } 
    }, this.state.label);
  }
}

window.ARSelect = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options || [], 
      value: this.props.multiple ? [] : ((this.props.options || []).length > 0 ? this.props.options[0].value : null), 
    };

    if (this.props.onInit) this.props.onInit(this);
  }

  componentWillMount() {
    if (this.props.onBeforeLoad) this.props.onBeforeLoad(this);
  }

  componentDidMount() {
    this.$el = $(this.el);
    this.$el
      .on('loaded.bs.select', function (e) {
        var cont = $(e.target).parents().filter(function() {
          if ($(this).hasClass('bootstrap-select')) return true;
          return false;
        });

        $(cont).addClass('form-control');
        $(cont).find('button').addClass('form-control').removeClass('btn-default');
      })
      .on('changed.bs.select', e => {
        this.setState({value: $(e.target).val()});
        if (this.props.onChange) this.props.onChange(this);
      })
      .selectpicker(this.props);

      if (this.props.onAfterLoad) this.props.onAfterLoad(this);
  }

  componentDidUpdate() {
    this.$el.selectpicker('refresh');
    if (this.props.onAfterLoad) this.props.onAfterLoad(this);
  }

  options(options) {
    this.$el.selectpicker('deselectAll');
    this.setState({
      options: options, 
      value: this.props.multiple ? [] : ((options || []).length > 0 ? options[0].value : null), 
    });
  }

  value() {
    return this.state.value;
  }

  render() {
    return React.createElement('select', {
        ref: el => this.el = el, 
        multiple: (this.props.multiple || false) 
      }, 
      this.state.options.map((d, idx) => React.createElement('option', { key: idx, value: d.value }, d.label))
    );
  }
}

window.ARFormControl = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'show' in this.props ? this.props.show : true, 
    };

    this.class_el = React.createElement(this.props.class, _.assign({
      ref: (el) => {
        this.class_impl = el;
      }, 
      onBeforeLoad: (el) => {
        if (this.props.onBeforeLoad) this.props.onBeforeLoad(el);
      }, 
      onAfterLoad: (el) => {
        if (this.props.onAfterLoad) this.props.onAfterLoad(el);
      }, 
      onChange: (el) => {
        if (this.props.onChange) this.props.onChange(el);
      }, 
      onClick: (el) => {
        if (this.props.onClick) this.props.onClick(el);
      }, 
    }, this.props.class_props));

    if (this.props.onInit) this.props.onInit(this);
  }

  show() {
    this.setState({show: true});
  }

  hide() {
    this.setState({show: false});
  }

  render() {
    return this.state.show ? React.createElement(ReactBootstrap.FormGroup, {}, 
        this.props.title ? React.createElement(ReactBootstrap.ControlLabel, {}, this.props.title) : null, 
        this.class_el, 
        this.props.help ? React.createElement(ReactBootstrap.HelpBlock, {}, this.props.help) : null,
      ) : null;
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

