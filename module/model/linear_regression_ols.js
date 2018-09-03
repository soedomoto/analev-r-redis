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
        if (this.props.onChange) this.props.onClick(el);
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

window.LinearRegressionOLS = class extends BaseModule {
	constructor(props) {
    super(props);
    this.state = {
      r_var: null, 
      e_vars: null, 
      // result: null, 
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

  render() {
  	return React.createElement('div', { className: 'row' }, 
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
            } else {
              this.btn_process.hide();
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

  // render_dataset_selection() {
  // 	return [React.createElement(ReactBootstrap.FormGroup, {key: 'dataset_selector'}, 
  //       React.createElement(ReactBootstrap.ControlLabel, {}, 'Dataset'), 
  //       React.createElement(ARSelect, {
  //         options: this.datasets().map((d) => {return {value: d.id, label: d.label}}), 
  //         onChange: (ev, value) => this.setState({ dataset_id: value }),
  //       }), 
  //     //   React.createElement('select', {
	 //     //      className: 'form-control', 
	 //     //      onChange: (ev) => this.setState({ dataset_id: ev.target.value })
	 //     //    }, 
  //     //   	React.createElement('option', { value: '' }, 'None'), 
  //   		// 	this.datasets().map((d, idx) => 
  //   		// 		React.createElement('option', { key: idx, value: d.id }, d.label)
  // 				// )
  //     //   ), 
  //       React.createElement(ReactBootstrap.HelpBlock, {}, 'Select dataset')
  //     )].concat(this.render_options());
  // }

  render_options() {
  	if (!this.dataset() || !this.dataset().variables) return [];

    return [
      React.createElement(ReactBootstrap.FormGroup, { key: 'response_variable_selector' }, 
        React.createElement(ReactBootstrap.ControlLabel, {}, 'Response Variable'), 
        React.createElement('select', {
          className: 'form-control', 
          onChange: (ev) => {
            this.setState({ r_var: ev.target.value });
          }
        }, 
        	React.createElement('option', { value: '' }, 'None'), 
          this.get_r_var().map((v, idx) => React.createElement('option', { key: idx, value: v }, v))
        ), 
        React.createElement(ReactBootstrap.HelpBlock, {}, 'Select response variable')
      ), 

      this.state.r_var_changing ? null : (
        React.createElement(ReactBootstrap.FormGroup, { key: 'explanatory_variable_selector' }, 
          React.createElement(ReactBootstrap.ControlLabel, {}, 'Explanatory Variables'), 
          React.createElement(ARSelect, {
            options: this.get_e_vars(), 
            multiple: true, 
            onChange: (ev, values) => {
            	this.setState({ e_vars: values })
            }
          }), 
          React.createElement(ReactBootstrap.HelpBlock, {}, 'Select explanatory variable')
        )
      ), 

      React.createElement(ReactBootstrap.FormGroup, { key: 'i_process' }, 
        React.createElement(ReactBootstrap.Button, { className: 'form-control', 
        	onClick: () => this.process_summarize() 
        }, 'Process')
      )
    ];
  }

  process_summarize() {
  	var _this = this;
    var cmds = [
      `
        library(broom) \n
        library(dplyr) \n
        library(magrittr) \n

        int <- ""\n
        dataset <- {0}\n
        r_var <- "{1}"\n
        e_vars <- "{2}"\n
        dataset_name <- "{3}"\n
        data_filter <- ""\n
        check <- ""\n

        dataset <- get_data(dataset, c(r_var, e_vars))\n

        var_check <- function(ev, cn, intv = "") {\n
          vars <- ev\n
          if (length(vars) < length(cn)) vars <- ev <- cn\n

          if (intv != "" && length(vars) > 1) {\n
            if ({\n
              intv %>% strsplit(":") %>% unlist()\n
            } %in% vars %>% all()) {\n
              vars <- c(vars, intv)\n
            } else {\n
              intv <- ""\n
            }\n
          }\n

          list(vars = vars, ev = ev, intv = intv)\n
        }\n

        minmax <- function(dataset) {\n
          isNum <- sapply(dataset, is.numeric)\n
          if (sum(isNum) == 0) return(dataset)\n
          cn <- names(isNum)[isNum]\n

          mn <- summarise_at(dataset, .vars = cn, .funs = funs(min(., na.rm = TRUE)))\n
          mx <- summarise_at(dataset, .vars = cn, .funs = funs(max(., na.rm = TRUE)))\n

          list(min = mn, max = mx)\n
        }\n

        sig_stars <- function(pval) {\n
          sapply(pval, function(x) x < c(.001, .01, .05, .1)) %>%\n
            colSums() %>%\n
            add(1) %>%\n
            c("", ".", "*", "**", "***")[.]\n
        }\n

        vars <- ""\n
        var_check(e_vars, colnames(dataset)[-1], int) %>%\n
        {vars <<- .$vars; evar <<- .$ev; int <<- .$intv}\n

        mmx <- minmax(dataset)\n

        form_upper <- paste(r_var, "~", paste(vars, collapse = " + ")) %>% as.formula()\n
        form_lower <- paste(r_var, "~ 1") %>% as.formula()\n

        model <- lm(form_upper, data = dataset)\n

        attr(model$model, "min") <- mmx[["min"]]\n
        attr(model$model, "max") <- mmx[["max"]]\n

        coeff <- tidy(model) %>% as.data.frame()\n
        colnames(coeff) <- c("  ", "coefficient", "std.error", "t.value", "p.value")\n

        coeff$sig_star  <- sig_stars(coeff$p.value) %>% format(justify = "left")\n
        colnames(coeff) <- c("label", "coefficient", "std.error", "t.value", "p.value", "sig_star")\n

        hasLevs <- sapply(dplyr::select(dataset, -1), function(x) is.factor(x) || is.logical(x) || is.character(x))\n
        if (sum(hasLevs) > 0) {\n
          for (i in names(hasLevs[hasLevs])) {\n
            coeff$label %<>% gsub(paste0("^", i), paste0(i, "|"), .) %>%\n
              gsub(paste0(":", i), paste0(":", i, "|"), .)\n
          }\n
          rm(i)\n
        }\n

        if (nrow(model$model) <= (length(e_vars) + 1)) {\n
          stop("Insufficient observations to estimate model\n")\n
        }\n

        e_vars <- strsplit(e_vars, ":")\n
        expl_var <- if (length(e_vars) == 1) e_vars else "x"\n

        # Multiple print is still buggy, only last print will be shown -> use print with paste instead\n
        print(paste(
          paste0("Linear regression (OLS)", "\n"), 
          paste0("Dataset: ", dataset_name, "\n"), 
          ifelse(data_filter %>% gsub("\s", "", .) != "", 
            cat("Filter   :", gsub("\n", "", object$data_filter), "\n"), ""
          ), 
          paste0("Response variable    :", r_var, "\n"), 
          paste0("Explanatory variables    :", paste0(e_vars, collapse = ", "), "\n"), 
          paste0(paste0("Null hyp.: the effect of ", expl_var, " on ", r_var, " is zero"), "\n"),
          paste0(paste0("Alt. hyp.: the effect of ", expl_var, " on ", r_var, " is not zero"), "\n"),
          ifelse("standardize" %in% check, 
            "**Standardized coefficients shown (2 X SD)**\n", 
            ifelse("center" %in% check, "**Centered coefficients shown (x - mean(x))**\n", "")
          ), 
          sep=""
        ))\n
      `.format(this.df(), this.state.r_var, this.state.e_vars.join(':'), this.dataset_name()), 
    ];

    this.textarea.clear();
    cmds.forEach((cmd) => analev_eval(cmd, (req_id, resp) => {
      resp = JSON.parse(resp);
      if (resp.success) {
        if(resp.data.text && resp.data.text != "NULL") this.textarea.append(resp.data.text);
        // this.setState({ result: resp.data.text })
      } else {
        this.textarea.value(resp.data.toString());
      }
    }))
  }
}