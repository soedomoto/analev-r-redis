<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin extends CI_Controller 
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
            'title' => 'Halaman Administrator', 
            'access_log_url' => $this->config->item("api_url_v2") . 'log/access', 
            'login_url' => base_url() . 'home/login', 
            'logout_url' => base_url() . 'home/logout', 
            'user' => $this->user, 
            'other_roles' => $other_roles
        );
    }
    
	public function index()
	{
		$this->load->view('admin/index', $this->data);
	}

    public function questionnaire()
    {
        $this->data['all_relations_url'] = $this->config->item("api_url_v2") . '/user_relation/all';
        
        $this->data['all_behavior_url'] = $this->config->item("api_url_v2") . '/behavior/all';
        $this->data['delete_behavior_url'] = $this->config->item("api_url") . '/behavior/delete';
        $this->data['add_behavior_x_editable_url'] = $this->config->item("api_url") . '/behavior/add_x_editable';
        $this->data['update_behavior_x_editable_url'] = $this->config->item("api_url") . '/behavior/update_x_editable';
        
        $this->data['all_statements_url'] = $this->config->item("api_url_v2") . '/statement/all';
        $this->data['delete_statement_url'] = $this->config->item("api_url_v2") . '/statement/delete';
        $this->data['change_statement_priority_url'] = $this->config->item("api_url_v2") . '/statement/change_priority';
        $this->data['add_statement_x_editable_url'] = $this->config->item("api_url_v2") . '/statement/add_x_editable';
        $this->data['update_statement_x_editable_url'] = $this->config->item("api_url_v2") . '/statement/update_x_editable';
        
        $this->data['statement_add_relation_url'] = $this->config->item("api_url") . '/statement/add_relation';
        $this->data['statement_remove_relation_url'] = $this->config->item("api_url") . '/statement/remove_relation';
        
        $this->load->view('admin/questionnaire', $this->data);
    }
    
    // public function user_role()
    // {
    //     $this->data['all_roles_url'] = $this->config->item("api_url") . '/role/all';
    //     $this->data['add_role_url'] = $this->config->item("api_url") . '/role/add';
    //     $this->data['update_role_url'] = $this->config->item("api_url") . '/role/update';
    //     $this->data['delete_role_url'] = $this->config->item("api_url") . '/role/delete';
        
    //     $this->load->view('admin/role', $this->data);
    // }

    // public function user()
    // {
    //     $this->data['all_users_url'] = $this->config->item("api_url") . '/user/all';
    //     $this->data['all_roles_url'] = $this->config->item("api_url") . '/role/all';
    //     $this->data['user_role_url'] = $this->config->item("api_url") . '/user/role';
    //     $this->data['grant_role_url'] = $this->config->item("api_url") . '/user/grant_role';
    //     $this->data['revoke_role_url'] = $this->config->item("api_url") . '/user/revoke_role';
        
    //     $this->load->view('admin/user', $this->data);
    // }
    
    public function user()
    {
        $this->data['all_roles_url'] = $this->config->item("api_url_v2") . '/user_role/all';
        $this->data['add_role_url'] = $this->config->item("api_url_v2") . '/user_role/add';
        $this->data['update_role_url'] = $this->config->item("api_url_v2") . '/user_role/update';
        $this->data['delete_role_url'] = $this->config->item("api_url_v2") . '/user_role/delete';
        
        $this->data['all_relations_url'] = $this->config->item("api_url_v2") . '/user_relation/all';
        $this->data['add_relation_url'] = $this->config->item("api_url_v2") . '/user_relation/add';
        $this->data['update_relation_url'] = $this->config->item("api_url_v2") . '/user_relation/update';
        $this->data['delete_relation_url'] = $this->config->item("api_url_v2") . '/user_relation/delete';
    
        $this->data['all_users_url'] = $this->config->item("api_url_v2") . '/user/all';
        $this->data['user_role_url'] = $this->config->item("api_url_v2") . '/user/role';
        $this->data['grant_role_url'] = $this->config->item("api_url_v2") . '/user/grant_role';
        $this->data['revoke_role_url'] = $this->config->item("api_url_v2") . '/user/revoke_role';
        
        $this->load->view('admin/user', $this->data);
    }
}
