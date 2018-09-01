<?php $this->load->view('templates/header'); ?>
<?php $this->load->view('home/menu'); ?>

<style type="text/css">
    .modal-lg {
        width: 95%;
    }
</style>

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

<script src="<?php echo assets_url() ?>/application/main_app.js"></script>
<script src="<?php echo assets_url() ?>/application/data_selector_app.js"></script>
<script src="<?php echo assets_url() ?>/application/data_preview_app.js"></script>
<script src="<?php echo assets_url() ?>/application/data_visualization_app.js"></script>
<script src="<?php echo assets_url() ?>/application/module_selector_app.js"></script>
<script src="<?php echo assets_url() ?>/application/module_open_app.js"></script>
<script src="<?php echo assets_url() ?>/application/module_base_app.js"></script>

<script type="text/javascript">
    $(function() {
        window.webdis_url = 'http://127.0.0.1:7379';
        window.session_id = '7c3fc291-ea44-4a47-1ef7-3f858a2de404'; //uuid();

        // Hide loading page indicator
        $('.loading-modal').addClass('animated').css('z-index', -1);

        ReactDOM.render(React.createElement(MainApp, {}), $('#main_content')[0]);
    });
</script>

<script type="text/javascript">
    $(function() {
        // ReactDOM.render(e(LikeButton), $('#like_button_container')[0]);
        // ReactDOM.render(e(Square), $('#like_button_container')[0]);
    })
</script>

<?php $this->load->view('templates/footer'); ?>
    