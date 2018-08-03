<div class="navbar navbar-fixed-top user-menu" style="background: #fff;">
    <div class="container">
        <div class="navbar-header">
            <a href="." class="navbar-brand"><img src="<?php echo assets_url(); ?>/logo.png"></a>

            <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>

            <!-- Show on desktop -->
            <ul class="nav navbar-nav hidden-xs">
                <li><a href="<?php echo base_url() . 'user' ?>">Beranda Pengguna</a></li>
                <li><a href="<?php echo base_url() . 'user/assessment' ?>">Evaluasi</a></li>
            </ul>

            <ul class="nav navbar-nav hidden-xs pull-right">
                <li class="header-icon drop-menu">
                    <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" role="link">
                        <img class="avatar-test" style="display: none;" />
                        <div class="avatar" style="width: 25px; padding-top: 25px; float: left;"></div>
                        <span class="user-avatar"> <?php echo isset($user->fullname) ? $user->fullname : ''; ?></span>
                    </span>
                    <ul class="dropdown-menu">
                        <?php foreach ($other_roles as $role) { ?>
                            <li><a href="<?php echo base_url() . $role->fallback_page ?>"><i class="ti-user"></i><span>Halaman <?php echo $role->name ?></span></a></li>
                        <?php } ?>
                        <li><a class="menu-logout" href="<?php echo $logout_url ?>">Logout</a></li>
                    </ul>
                </li>
            </ul>
            <!-- /Show on desktop -->
        </div>

        <!-- Show on mobile -->
        <div class="hidden-sm hidden-md hidden-lg hidden-xl collapse" id="navbar-main">
            <ul class="nav navbar-nav navbar-right">
                <?php foreach ($other_roles as $role) { ?>
                    <li><a href="<?php echo base_url() . $role->fallback_page ?>">Halaman <?php echo $role->name ?></a></li>
                <?php } ?>
                <li class="divider"></li>
                <li><a class="menu-logout" href="<?php echo $logout_url ?>">Logout</a></li>
            </ul>
        </div>
    </div>
    <div class="hidden-sm hidden-md hidden-lg hidden-xl">
        <div class="container navbar-container">
            <div class="navbar-nav-scroll">
                <ul class="nav navbar-nav flex-row main-menu">
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo base_url() . 'user' ?>">Beranda Pengguna</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?php echo base_url() . 'user/assessment' ?>">Penilaian</a>
                    </li>
                </ul>
            </div>
            <!-- /Show on mobile -->
        </div>
    </div>
</div>

<script type="text/javascript">
    $(function() {
        
    });
</script>