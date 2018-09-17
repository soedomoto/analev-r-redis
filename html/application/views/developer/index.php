<?php $this->load->view('templates/header'); ?>
<?php $this->load->view('developer/menu'); ?>

<script type="text/javascript" src="https://cdn.webix.com/edge/webix.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.webix.com/edge/webix.css">

<script>var require = { paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs' } };</script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/editor/editor.main.css">

<div class="content-wrap">
  <div class="main">
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <div class="page-header">
            <div class="row">
              <!-- Title -->
              <div class="col-lg-8 col-md-8 col-sm-6">
                <div class="page-title">
                  <h1>Dashboard</h1>
                </div>
              </div>

              <!-- Breadcrumb -->
              <div class="col-lg-4 col-md-4 col-sm-6">
                <div class="page-title">
                  <ol class="breadcrumb text-right">
                    <li><a href="<?php echo base_url() . 'user' ?>">Pengguna</a></li>
                    <li class="active">Dashboard</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="main_content"></div>
    </div>
  </div>
</div>

<script type="text/javascript">
	webix.protoUI({
		name:"monaco-editor", 
		defaults:{
			on: {
				'onChange' : function(e) {}
			}
		},       
		$init:function(config){ 
			this._waitEditor = webix.promise.defer();
			this.$ready.push(this._render_cm_editor);
		},
		_render_cm_editor: function() {
			webix.require([
				"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/loader.js", 
				"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/editor/editor.main.nls.js", 
				"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.14.3/min/vs/editor/editor.main.js"
			], this._render_when_ready, this);
		}, 
		_render_when_ready: function() {
			this._editor = monaco.editor.create(this.$view, {
				language: 'javascript',
				automaticLayout: true
			});

			this._editor.onDidChangeModelContent((e) => {
	       this.config.on.onChange(e);
	    });

			this._waitEditor.resolve(this._editor);
		}, 
		setValue:function(value, language='javascript'){
			if(!value && value !== 0) value = "";
			if(this._editor){
				this._editor.setValue(value);
				monaco.editor.setModelLanguage(this._editor.getModel(), language);
				this._editor.getModel()._resetTokenizationState()
			}
		},
		getValue:function(){
			return this._editor ? this._editor.getValue() : '';
		},
		getEditor:function(waitEditor){
			return waitEditor?this._waitEditor:this._editor;
		}
	}, webix.ui.view); // extended functionality
</script>

<script type="text/javascript">
    $(function() {
      window.webdis_url = 'http://127.0.0.1:7379';
      window.session_id = '7c3fc291-ea44-4a47-1ef7-3f858a2de404'; //uuid();
      window.ext_lang_map = {
      	'js': 'javascript', 
      	'r': 'r'
      };

      // Hide loading page indicator
      $('.loading-modal').addClass('animated').css('z-index', -1);

      webix.ui({
			  container:"main_content",
			  height: 500, 
			  cols:[
				  { 
					  view:"tree", 
					  id: 'list_modules', 
					  width: 250, 
					  data: [{
					  	id:"root", 
					  	value:"Modules", 
					  	open:true
					  }], 
				    on: {
				    	onItemClick: function(id, e, node){
						    var item = this.getItem(id);

						    if (item.$count == 0) {
									if ('content' in item) {
										this.select(id);
										$$('editor').setValue(item.content, window.ext_lang_map[item.extension.toLowerCase()]);
									}
						    }
							}
				    }
					}, 
					{
						view:"resizer"
					},
					{
						rows: [{
							view: "toolbar",
    					id: "editor_toolbar", 
    					cols: [{
    						view:"button", 
    						value:"Save", 
    						width:100, 
    						align:"right", 
    						click: () => {
    							var file_id = $$('list_modules').getSelectedId();
									var file = $$('list_modules').getItem(file_id);
    							var curr_code = $$('editor').getValue();

    							analev_call('module.file.save', [file_id, curr_code], function(_req_id, resp) {
							      var resp = JSON.parse(resp);
							      if (resp.success) {
							        $$('list_modules').updateItem(file_id, {
							        	value: '{0}.{1}'.format(file.filename, file.extension), 
							        	content: curr_code, 
							        	remote_content: curr_code
							        });
							      }
							    });
    						}
    					}, {
    						view:"button", 
    						value:"Discard", 
    						width:100, 
    						align:"right", 
    						click: () => {
    							var file_id = $$('list_modules').getSelectedId();
									var file = $$('list_modules').getItem(file_id);

									$$('editor').setValue(file.remote_content, window.ext_lang_map[file.extension.toLowerCase()]);
    						}
    					}]
						}, {
							view: "monaco-editor",
							id: 'editor', 
							on: {
								'onChange': function(e) {
									var file_id = $$('list_modules').getSelectedId();
									var file = $$('list_modules').getItem(file_id);
									var curr_code = $$('editor').getValue();
									var changes = curr_code != file.remote_content;

									$$('list_modules').updateItem(file_id, {
										value: changes ? '{0}.{1}*'.format(file.filename, file.extension) : '{0}.{1}'.format(file.filename, file.extension), 
										content: curr_code
									});
								}
							}
						}]
					}
			  ]
			});

			webix.ui({
			  view:"contextmenu",
			  id:"list_modules_menu",
			  data:["Add","Rename","Delete",{ $template:"Separator" },"Info"],
			  on:{
			    onItemClick:function(id){
			      var context = this.getContext();
			      var list = context.obj;
			      var listId = context.id;
			      webix.message("List item: <i>"+list.getItem(listId).title+"</i> <br/>Context menu item: <i>"+this.getItem(id).value+"</i>");
			    }
			  }
			});

			$$("list_modules_menu").attachTo($$("list_modules"));

			// Load all module(s)
			analev_call('module.all', [], function(req_id, resp) {
	      resp = JSON.parse(resp);
	      if (resp.success) {
	        resp.data.forEach(function (d) {
	        	$$('list_modules').data.add({
	        		id: d.id, value: d.label, open: true, 
	        	}, -1, 'root' );

						// Load file(s) associated with each module
	        	analev_call('module.files', [d.id], function(req_id, resp) {
				      resp = JSON.parse(resp);
				      if (resp.success) {
				        resp.data.forEach(function (d) {
				        	$$('list_modules').data.add({
				        		id: d.id, value: '{0}.{1}'.format(d.filename, d.extension), filename: d.filename, extension: d.extension, 
				        	}, -1, d.module_id );

				        	// Map filename to file_id
				        	if (!('filename_fileid_map' in window)) window.filename_fileid_map = {};
				        	window.filename_fileid_map[d.filename] = d.id;

									// Load content of each file
									var req_id = uuid();
									if (!('fileid_reqid_map' in window)) window.fileid_reqid_map = {};
				        	window.fileid_reqid_map[req_id] = d.id;

				        	analev_call('module.file.read', [d.module_id, d.id + '.' + d.extension], function(_req_id, resp) {
							      var resp = JSON.parse(resp);
							      if (resp.success) {
							        var file_id = window.fileid_reqid_map[_req_id];
							        $$('list_modules').updateItem(file_id, {
							        	remote_content: resp.data, 
							        	content: resp.data
							        });
							        delete window.fileid_reqid_map[req_id];
							      }
							    }, req_id);
				        });
				      }
				    });
	        });
	      }
	    });
    });
</script>

<?php $this->load->view('templates/footer'); ?>