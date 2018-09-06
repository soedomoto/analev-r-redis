<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Developer extends CI_Controller 
{

    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url_helper');
        $this->load->helper('assets');
        $this->load->helper('cookie');
        $this->load->library('user_agent');
    }
    
	public function index()
	{
        $this->load->view('developer/index');
	}
}