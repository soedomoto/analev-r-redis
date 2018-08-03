<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Supervisor extends CI_Controller 
{
    private $user;
    private $data;

    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url_helper');
        $this->load->helper('assets');
        $this->load->helper('cookie');

        $this->user = get_user_from_cookie();

        // Authorized page
        $authd_pages = array_map(function($role) {
            return $role->fallback_page;
        }, $this->user ? $this->user->roles : array());
        
        if($this->user == NULL) {
            $current_page = str_replace(base_url(), '', current_url());
            redirect(base_url() . '?next=' . $current_page, 'location');
        } else if (!in_array(strtolower(get_class($this)), $authd_pages)) {
            redirect(base_url(), 'location');
        }

        // Base data
        $self = $this;
        $other_roles = array_filter($this->user->roles ?: array(), function($role) use ($self) {
            if ($role->fallback_page == strtolower(get_class($self))) return false;
            return true;
        });

        $this->data = array(
            'title' => 'Halaman Pemantau', 
            'access_log_url' => $this->config->item("api_url_v2") . 'log/access', 
            'login_url' => base_url() . 'home/login', 
            'logout_url' => base_url() . 'home/logout', 
            'user' => $this->user, 
            'other_roles' => $other_roles
        );
        
        $this->data['month_name_map_short'] = array(
            1 => 'Jan', 
            2 => 'Feb', 
            3 => 'Mar', 
            4 => 'Apr', 
            5 => 'Mei', 
            6 => 'Jun', 
            7 => 'Jul', 
            8 => 'Ags', 
            9 => 'Sep', 
            10 => 'Okt', 
            11 => 'Nov', 
            12 => 'Des'
        ); 
    }
    
	public function index() 
	{
		$this->load->view('supervisor/index', $this->data);
	}
	
	public function assessment_v1()
    {
        $this->data['all_sessions_url'] = $this->config->item("api_url_v2") . 'session/all';
	    $this->data['current_session_url'] = $this->config->item("api_url_v2") . 'session/current';
        $this->data['responses_summary_url'] = $this->config->item("api_url_v2") . 'summary/responses/office_unit/' . $this->user->office_unit_id;
        $this->data['statement_summary_url'] = $this->config->item("api_url_v2") . 'summary/statements/office_unit/' . $this->user->office_unit_id;
        $this->data['access_summary_url'] = $this->config->item("api_url_v2") . 'summary/access/office_unit/' . $this->user->office_unit_id;
        
        $this->load->view('supervisor/assessment', $this->data);
    }

    public function assessment()
    {
        $this->data['all_sessions_url'] = $this->config->item("api_url_v2") . 'session/all';
        $this->data['current_session_url'] = $this->config->item("api_url_v2") . 'session/current';
        $this->data['responses_summary_url'] = $this->config->item("api_url_v2") . 'summary/responses/office_unit/' . $this->user->office_unit_id;
        $this->data['statement_summary_url'] = $this->config->item("api_url_v2") . 'summary/statements/office_unit/' . $this->user->office_unit_id;
        $this->data['access_summary_url'] = $this->config->item("api_url_v2") . 'summary/access/office_unit/' . $this->user->office_unit_id;

        $this->data['responses_by_url'] = $this->config->item("api_url_v2") . 'summary/response_detail';
        $this->data['performance_by_url'] = $this->config->item("api_url_v2") . 'assessment/performance_by_unit';
        $this->data['unit_echelon_url'] = $this->config->item("api_url_v2") . 'unit/by_echelon/echelon/2-3';
        
        $this->load->view('supervisor/assessment_v2', $this->data);
    }
}
