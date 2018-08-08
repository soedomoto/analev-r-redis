    <style type="text/css">
        #alert_feedback {
            position: fixed;
            bottom: 0px;
            margin: 0 20px;
        }
        #btn_alert_feedback {
            position: fixed;
            bottom: 0px;
            right: 0px;
            margin-right: 30px;
            padding: 10px 10px 5px;
            background-color: #f9cf8b;
            border-radius: 10px 10px 0 0;
        }
        .ln-feedback {
            color: red;
            font-weight: bold;
        }
    </style>

    <div class="modal fade" id="feedback_dialog" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="feedback_dialog_label">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <form method="post" action="<?php echo $submit_feedback_url ?>">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title" id="feedback_dialog_label" style="padding-right: 50px;">
                            Laporan dan Masukan
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div>Tuliskan dengan selengkap-lengkapnya laporan permasalahan serta saran dan masukan Anda</div>
                        <textarea name="feedback" class="form-control" rows="3"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div id="alert_feedback" class="animated">
        <div class="alert alert-warning alert-dismissable">
            <a href="#" class="close" aria-label="close"><i class="ti-arrow-circle-down"></i></a>
            <strong>Feedback</strong><br /> Kami berkomitmen untuk memberikan yang terbaik untuk Anda, untuk itu segala keluhan dan masukan dari Anda sangat kami perlukan. Silahkan akses <a href="#open-feedback" class="ln-feedback">link <i class="ti-help-alt"></i></a> berikut untuk memberikan masukan dan laporan permasalahan.
        </div>
    </div>

    <div id="btn_alert_feedback" class="pull-right animated slideOutDown">
        <a href="#" id="ln_alert_feedback">Feedback</a>
    </div>
    
    <script>
        function submit_feedback(url, data, finished, gfailed) {
            function failed(message) {
                sweetAlert('Terjadi kesalahan dalam penyimpanan feedback dengan pesan kesalahan \'' + message + '\'. Silahkan simpan ulang atau reload halaman. Jika masalah masih berlanjut, silahkan hubungi administrator !', "error")
                    .then(function() {
                        if (gfailed) gfailed();
                    });
            }
            
            ajax_post(url, data, function(resp) {
                if (resp.success) {
                    finished(resp.data);
                } else {
                    failed(resp.message);
                }
            }, function(message) {
                failed(message);
            });
        }

        $('#feedback_dialog').on('show.bs.modal', function () {
            var $modal = $(this), 
                $feedback = $modal.find('[name=feedback]').summernote();

            $(this).find('form')
                .unbind('submit')
                .bind('submit', function (e) {
                    e.preventDefault();
                    $form = $(this);
                    
                    // Change hash
                    location.hash = '#save-feedback';
                    
                    swal({
                        title: "Menyimpan...", 
                        showCancelButton: false, 
                        showConfirmButton: false, 
                        content: {
                            element: "img",
                            attributes: {
                              src: "<?php echo assets_url() ?>/loading-200px.gif"
                            },
                          },
                    }).then(function() {
                        location.hash = '';
                    });

                    submit_feedback($(this).attr('action'), {'feedback': $feedback.val()}, function saved() {
                        swal.close();

                        swal("Feedback Anda telah disimpan. Terima kasih atas partisipasi Anda", {
                            icon: "success",
                        }).then(function() {
                            $('#feedback_dialog').modal('hide');
                        });
                    });
                    
                    return false;
                });
        });

        $('#feedback_dialog').on('hidden.bs.modal', function () {
            $('[name=feedback]').each(function() {
                $(this).summernote('destroy');
            });
            location.hash = '';
        });

        $(function() {
            Pace.on('done', function() {});

            $('#alert_feedback .close').on('click', function(e) {
                e.preventDefault();
                $('#alert_feedback').addClass('slideOutDown');
                $('#btn_alert_feedback').removeClass('slideOutDown').addClass('slideInUp');
                return false;
            });

            setTimeout(function() { $('#alert_feedback .close').trigger('click'); }, 3000);

            $('#btn_alert_feedback a').on('click', function(e) {
                e.preventDefault();
                $('#alert_feedback').removeClass('slideOutDown').addClass('slideInUp');
                $('#btn_alert_feedback').removeClass('slideInUp').addClass('slideOutDown');
                return false;
            });

            $('.ln-feedback').on('click', function(e) {
                // e.preventDefault();
                $('#feedback_dialog').modal();
            });

            // Logger
            function log_access(url, data, finished, gfailed) {
                function failed(message) {
                    console.log('Terjadi kesalahan dalam penyimpanan isian dengan pesan kesalahan \'' + message + '\'. Silahkan simpan ulang atau reload halaman. Jika masalah masih berlanjut, silahkan hubungi administrator !');
                }
                
                ajax_post(url, data, function(resp) {
                    if (resp.success) {
                        if(finished) finished(resp.data);
                    } else {
                        if(failed) failed(resp.message);
                    }
                }, function(message) {
                    if(failed) failed(message);
                });
            }
        });
    </script>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
    <!-- Loading indicator -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pace/1.0.2/pace.min.js"></script>
    <!-- Alert -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.0/sweetalert.min.js"></script>
    <!-- Datatables -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.16/js/jquery.dataTables.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.16/js/dataTables.bootstrap.min.js"></script>
    <script src="https://cdn.datatables.net/fixedheader/3.1.4/js/dataTables.fixedHeader.min.js"></script>
    <!-- Highchart -->
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <!-- Bar ratings -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-bar-rating/1.2.2/jquery.barrating.min.js"></script>
    <!-- WYSIWYG -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.js"></script>
    <!-- sidebar -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.nanoscroller/0.8.4/javascripts/jquery.nanoscroller.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.6.0/papaparse.min.js"></script>
    <!-- LZW -->
    <script src="<?php echo assets_url() ?>/lzw/lzw.js"></script>


    <!-- <script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script> -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.4.2/umd/react.development.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.4.2/umd/react-dom.development.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap/0.32.1/react-bootstrap.min.js"></script>

    <script src="<?php echo assets_url() ?>/application/webdis-rpc.js"></script>
    <script src="<?php echo assets_url() ?>/application/application.js"></script>
</body>

</html>