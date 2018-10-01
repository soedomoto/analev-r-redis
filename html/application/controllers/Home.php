<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller 
{

    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url_helper');
        $this->load->helper('assets');
        $this->load->helper('uuid');
        $this->load->helper('cookie');
        $this->load->helper('session');
        $this->load->library('user_agent');

        $this->user = get_user_from_cookie();
        if($this->user == NULL) {
            $current_page = str_replace(base_url(), '', current_url());
            redirect(base_url() . 'user/login?next=' . $current_page, 'location');
        }

        $this->data = array(
            'broker_url' => $this->config->item("broker_url"), 
            'logout_url' => base_url() . 'user/clogout'
        );
    }
    
	public function index()
	{
        $this->load->view('home/index', $this->data);
	}
}
