// ui.js

window.LinRegOCS = class extends BaseModule {
	constructor(props) {
    super(props);
    this.state = {
      r_var: null, 
      e_vars: null, 
      conf_lev: 0.95, 
      tab: null, 
    };
  }
}
