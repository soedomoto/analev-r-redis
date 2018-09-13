window.eval_file = function(filename, params, callback) {    
  analev_call('module.file.name.eval', [filename, params], function(_req_id, resp) {
    var resp = JSON.parse(resp);
    if (resp.success) {
      if (callback) {
        callback(resp.data.text);
      }
    } else {
      if (callback) {
        callback(resp.data.toString());
      }
    }
  });
}

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

  dataset_var() {
    return this.dataset() ? 'df' + this.dataset().idx : null;
  }

  dataset_name() {
    return this.dataset().label;
  }
}

window.ARTabs = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: null, 
    };

    if (this.props.onInit) this.props.onInit(this);
  }

  componentDidMount() {
    if (this.props.children.length > 0 && this.state.key == null) {
      this.setState({key: this.props.children[0].key ? this.props.children[0].key : 1});
    }
  }

  componentDidUpdate() {
    if (this.props.onChange) this.props.onChange(this);
  }

  render() {
    return React.createElement(ReactBootstrap.Tabs, {
        id: 'tabs', 
        activeKey: this.state.key, 
        onSelect: (key) => {
          this.setState({key: key});
        }
      }, 
      this.props.children.map((el, idx) => React.createElement(ReactBootstrap.Tab, {
        key: el.key ? el.key : (idx+1), eventKey: el.key ? el.key : (idx+1), title: el.props.title ? el.props.title : 'Tab ' + (idx+1)
      }, el))
    );
  }
}

window.ARSlider = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || 5
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
    if ((! this.last_value) || (this.last_value != this.state.value)) {
      this.last_value = this.state.value;
      this.props.onChange(this);
    }
  }

  value() {
    return this.state.value;
  }

  render() {
    return React.createElement(Slider.default, {
      min: this.props.min || 0, 
      max: this.props.max || 10, 
      step: this.props.step || 1, 
      value: this.state.value, 
      onChange: (value) => {
        this.setState({value: value});
      }, 
    });
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

  click() {
    if(this.props.onClick) this.props.onClick();
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

  impl() {
    return this.class_impl;
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

