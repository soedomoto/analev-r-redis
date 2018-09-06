<?php $this->load->view('templates/header'); ?>
<?php $this->load->view('developer/menu'); ?>

<script type="text/javascript" src="https://cdn.webix.com/edge/webix.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.webix.com/edge/webix.css">

<script type="text/javascript" src="https://cdn.webix.com/components/ace/ace.js"></script>
<script>
	webix.codebase = "https://cdn.webix.com/components/ace/";
</script>

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

    $(function() {
      window.webdis_url = 'http://127.0.0.1:7379';
      window.session_id = '7c3fc291-ea44-4a47-1ef7-3f858a2de404'; //uuid();

      // Hide loading page indicator
      $('.loading-modal').addClass('animated').css('z-index', -1);

      webix.ui({
			  container:"main_content",
			  height: 400, 
			  cols:[
				  { 
					  view:"tree", 
					  id: 'list_modules', 
					  data: [{
					  	id:"root", 
					  	value:"Modules", 
					  	open:true
					  }], 
				    on: {
				    	onItemClick: function(id, e, node){
						    var item = this.getItem(id);
						    if (item.$count == 0) {
									analev_call('module.file.read', [item.$parent, item.id + '.' + item.extension], function(req_id, resp) {
							      resp = JSON.parse(resp);
							      if (resp.success) {
							        $$('editor').setValue(resp.data)
							        // $$('editor').setMode(item.extension)
							      }
							    });
						    }
							}
				    }
					}, 
					{
						view:"resizer"
					},
					{
						view: "ace-editor",
						id: 'editor', 
						// theme: "monokai",
						mode: "javascript"
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

			analev_call('module.all', [], function(req_id, resp) {
	      resp = JSON.parse(resp);
	      if (resp.success) {
	        resp.data.forEach(function (d) {
	        	$$('list_modules').data.add({
	        		id: d.id, value: d.label, open: true, 
	        	}, -1, 'root' );

	        	analev_call('module.files', [d.id], function(req_id, resp) {
				      resp = JSON.parse(resp);
				      if (resp.success) {
				        resp.data.forEach(function (d) {
				        	$$('list_modules').data.add({
				        		id: d.id, value: d.filename, extension: d.extension, 
				        	}, -1, d.module_id );
				        });
				      }
				    });
	        });
	      }
	    });
    });
</script>

<?php $this->load->view('templates/footer'); ?>