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
        // Hide loading page indicator
        $('.loading-modal').addClass('animated').css('z-index', -1);

        // ReactDOM.render(React.createElement(MainApp, {}), $('#main_content')[0]);

        webix.ui({
				  container:"main_content",
				  cols:[
					  { 
						  view:"tree", 
						  data: [
				        {id:"root", value:"Modules", open:true, data:[
			            { id:"1", open:true, value:"Linear Regression (OLS)", data:[
		                { id:"1.1", value:"ui.js" },
		                { id:"1.2", value:"summary.R" },
		                { id:"1.3", value:"plot.R" }
			            ]},
			            { id:"2", open:true, value:"Logistic Regression (GLM)", data:[
		                { id:"2.1", value:"ui.js" },
		                { id:"2.2", value:"summary.R" }, 
		                { id:"2.3", value:"predict.R" }
			            ]}
				        ]}
					    ]
						}, 
						{
							view:"resizer"
						},
						{
							view: "ace-editor",
							// theme: "monokai",
							mode: "javascript",
							value: '\n\t var t = Math.sin(0.98);'
						}
				  ]
				});

				// webix.ui({ 
		  //   	container:"main_content",
				//   view:"tree", 
				//   data: [
		  //       {id:"root", value:"Modules", open:true, data:[
	   //          { id:"1", open:true, value:"Linear Regression (OLS)", data:[
    //             { id:"1.1", value:"ui.js" },
    //             { id:"1.2", value:"summary.R" },
    //             { id:"1.3", value:"plot.R" }
	   //          ]},
	   //          { id:"2", open:true, value:"Logistic Regression (GLM)", data:[
    //             { id:"2.1", value:"ui.js" },
    //             { id:"2.2", value:"summary.R" }, 
    //             { id:"2.3", value:"predict.R" }
	   //          ]}
		  //       ]}
			 //    ]
				// });
    });
</script>

<?php $this->load->view('templates/footer'); ?>