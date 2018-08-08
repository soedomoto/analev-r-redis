<?php $this->load->view('templates/header'); ?>
<?php $this->load->view('home/menu'); ?>

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

            <div id="main-content">
                <div class="row">
                    <!-- Left panel -->
                    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                        <div class="card alert">
                            <div class="card-header">
                                <h4>Pilih Data</h4>
                            </div>
                            <div class="card-body">
                                <div id="dataset_selector"></div>
                            </div>
                        </div>
                    </div>
            
                    <!-- Main panel -->
                    <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                        <div class="card alert">
                            <div class="card-header">
                                <h4>Masukkan Parameter</h4>
                            </div>
                            <div class="card-body">
                                Body Hasil
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
    $(function() {
        window.webdis_url = 'http://127.0.0.1:7379';
        window.session_id = uuid();

        // Hide loading page indicator
        $('.loading-modal').addClass('animated').css('z-index', -1);

        ReactDOM.render(React.createElement(DataSelectorApp, {}), $('#dataset_selector')[0]);
    });
</script>

<script type="text/javascript">
    $(function() {
        // ReactDOM.render(e(LikeButton), $('#like_button_container')[0]);
        // ReactDOM.render(e(Square), $('#like_button_container')[0]);
    })
</script>

<?php $this->load->view('templates/footer'); ?>
    