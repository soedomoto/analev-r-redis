window.LinearRegressionOLS = class extends BaseModule {
	constructor(props) {
    super(props);
    this.state = {
      r_var: null, 
      e_vars: null, 
      r_var_changing: false, 
      // result: null, 
    };
  }

  componentWillUpdate(props, state) {
    if (state.r_var != this.state.r_var) this.setState({ r_var_changing: true });
  }

  componentDidUpdate(props, state) {
    if(this.state.r_var_changing) this.setState({ r_var_changing: false });
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
      	this.render_dataset_selection()), 
      React.createElement('div', { className: 'col-lg-8 col-md-8 col-sm-12 col-xs-12' }, 
        React.createElement(ReactCodeMirror, { ref: (el) => this.textarea = el })
      )
    )
  }

  render_dataset_selection() {
  	return [React.createElement(ReactBootstrap.FormGroup, {key: 'dataset_selector'}, 
        React.createElement(ReactBootstrap.ControlLabel, {}, 'Dataset'), 
        React.createElement('select', {
	          className: 'form-control', 
	          onChange: (ev) => this.setState({ dataset_id: ev.target.value })
	        }, 
        	React.createElement('option', { value: '' }, 'None'), 
    			this.selected_datasets().map((d, idx) => 
    				React.createElement('option', { key: idx, value: d.id }, d.label)
  				)
        ), 
        React.createElement(ReactBootstrap.HelpBlock, {}, 'Select dataset')
      )].concat(this.render_options());
  }

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
          React.createElement(BootstrapSelect, {
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
      `.format(this.df(), this.state.r_var, this.state.e_vars.join(':'), this.dataset_name()), 

      `print("Linear regression (OLS)")`, 
      `print(paste("Dataset: ", dataset_name))`
    ];

    cmds.forEach((cmd) => analev_eval(cmd, (req_id, resp) => {
      resp = JSON.parse(resp);
      if (resp.success) {
        if(resp.data.text && resp.data.text != "NULL") this.textarea.append(resp.data.text);
        // this.setState({ result: resp.data.text })
      } else {
        console.log(resp.data)
      }
    }))
  }
}