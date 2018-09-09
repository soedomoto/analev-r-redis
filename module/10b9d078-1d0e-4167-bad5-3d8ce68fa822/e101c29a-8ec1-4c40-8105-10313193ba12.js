window.LinearRegressionOLS = class extends BaseModule {
	constructor(props) {
    super(props);
    this.state = {
      r_var: null, 
      e_vars: null, 
    };
  }

  df() {
    return this.dataset() ? 'df' + this.dataset().idx : null;
  }

  dataset_name() {
    return this.dataset().label;
  }

  get_r_var() {
    return this.dataset().variables;
  }

  get_e_vars() {
    return this.dataset().variables.filter((v) => v != this.state.r_var);
  }

  componentDidMount() {
    this.$row = $(this.row);
    console.log(this.$row)
    this.$row.on('resize', () => {
        alert('xxx');
    });
  }

  render() {
  	return React.createElement('div', { className: 'row', ref: (el) => this.row = el }, 
      React.createElement('div', { className: 'col-lg-4 col-md-4 col-sm-12 col-xs-12' }, 
      	// this.render_dataset_selection(), 
        React.createElement(ARFormControl, {
          onInit: (el) => {
            this.dataset_form = el;
          }, 
          onAfterLoad: (el) => {
            this.state.dataset_id = el.value();
            if (this.r_var_form) {
              this.r_var_form.show();
              if (this.r_var_form.class_impl) {
                this.r_var_form.class_impl.options(this.get_r_var().map((v) => {
                  return {value: v, label: v}
                }));
              }
            }
          },
          title: 'Dataset', 
          help: 'Select dataset', 
          class: ARSelect, 
          class_props: {
            options: Object.values(this.datasets()).map((d) => { return {value: d.id, label: d.label} }), 
          }, 
        }), 
        React.createElement(ARFormControl, {
          onInit: (el) => {
            this.r_var_form = el;
          }, 
          onAfterLoad: (el) => {
            this.state.r_var = el.value();
            if (this.e_vars_form) {
              this.e_vars_form.show();
              if (this.e_vars_form.class_impl) {
                this.e_vars_form.class_impl.options(this.get_e_vars().map((v) => {
                  return {value: v, label: v}
                }));
              }
            }
          }, 
          onChange: (el) => {
            el.props.onAfterLoad(el);
          },
          show: false,
          title: 'Response Variable', 
          help: 'Select response variable', 
          class: ARSelect, 
          class_props: {}
        }), 
        React.createElement(ARFormControl, {
          onInit: (el) => {
            this.e_vars_form = el;
          }, 
          onAfterLoad: (el) => {
            if (! _.isEmpty(el.value())) {
              this.btn_process.show();
              this.state.e_vars = el.value();
            } else {
              this.btn_process.hide();
              this.state.e_vars = [];
            }
          }, 
          onChange: (el) => {
            el.props.onAfterLoad(el);
          },
          show: false,
          title: 'Explanatory Variable', 
          help: 'Select explanatory variables', 
          class: ARSelect, 
          class_props: {
            multiple: true
          }
        }), 
        React.createElement(ARFormControl, {
          onInit: (el) => {
            this.btn_process = el;
          }, 
          onClick: () => {
            this.process_summarize();
          }, 
          show: false,
          class: ARButton, 
          class_props: {
            label: 'Process', 
          }
        }), 
      ), 
      React.createElement('div', { className: 'col-lg-8 col-md-8 col-sm-12 col-xs-12' }, 
        React.createElement(ReactCodeMirror, { ref: (el) => this.textarea = el })
      )
    )
  }

  process_summarize() {
    eval_file('summary', {
        dataset: this.df(), 
        r_var: this.state.r_var, 
        e_vars: this.state.e_vars.join(':'), 
        dataset_name: this.dataset_name()
      }, (data) => {
        this.textarea.value(data);
      });
  }
}


