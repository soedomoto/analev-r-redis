<?php 

if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}

if (! function_exists('assets_url')) {
    function assets_url()
    {
        return base_url() . 'assets';
    }
}
