<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller 
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

        // Temporary closed
        $whitelist_users = array('340050036', '340055893', '340054634', '340020413', '340017913', '340015390', '340016094', '340055302', '340057068', '340017805', '340017833', '340018510', '340053415', '340017078', '340014916', '340014723');
        if ($this->router->fetch_method() != 'closed_hour' && !in_array($this->user->nip, $whitelist_users)) {
            redirect(base_url() . 'user/closed_hour', 'location');
        }
        
        // Open only 9-12 am
        // $hour = date('H');
        // if (($hour < 9 || $hour > 16) && $this->router->fetch_method() != 'closed_hour') {
            // redirect(base_url() . 'user/closed_hour', 'location');
        // }

        // Base data
        $self = $this;
        $other_roles = array_filter($this->user->roles ?: array(), function($role) use ($self) {
            if ($role->fallback_page == strtolower(get_class($self))) return false;
            return true;
        });

        $this->data = array(
            'title' => 'Halaman Pengguna', 
            'access_log_url' => $this->config->item("api_url_v2") . 'log/access', 
            'login_url' => base_url() . 'home/login', 
            'logout_url' => base_url() . 'home/logout', 
            'user' => $this->user, 
            'profil_url' => $this->config->item("api_url_v2") . 'user/avatar/nip/' . $this->user->nip, 
            'avatar_url_url' => $this->config->item("api_url_v2") . 'user/avatar_url', 
            'submit_feedback_url' => $this->config->item("api_url_v2") . 'feedback/submit/rater/' . $this->user->nip,
            'other_roles' => $other_roles
        );
    }
    
    public function index()
	{
	    $this->data['all_sessions_url'] = $this->config->item("api_url_v2") . 'session/all';
	    $this->data['current_session_url'] = $this->config->item("api_url_v2") . 'session/current';
	    
        $this->data['swot_url'] = $this->config->item("api_url_v2") . 'assessment/swot/rated/' . $this->user->nip;
        $this->data['performance_url'] = $this->config->item("api_url_v2") . 'assessment/performance/rated/' . $this->user->nip;
        $this->data['range_performance_url'] = $this->config->item("api_url_v2").
            'assessment/performance_change/rated/' . $this->user->nip;
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

        // $this->load->view('user/index', $this->data);
        $this->load->view('webstrot/user/index', $this->data);
	}
    
    public function assessment()
    {
        $this->data['avatar_url'] = $this->config->item("api_url_v2") . 'user/avatar';
        $this->data['update_avatar_url_url'] = $this->config->item("api_url_v2") . 'user/update_avatar_url';
        $this->data['current_session_url'] = $this->config->item("api_url_v2") . 'session/current';
        $this->data['rateds_url'] = $this->config->item("api_url_v2") . 'assessment/rated/rater/' . $this->user->nip;
        $this->data['all_statements_url'] = $this->config->item("api_url_v2") . 'statement/all';
        $this->data['all_statements_by_user_relation_url'] = $this->config->item("api_url_v2") . 'statement/all_by_user_relation';
        $this->data['post_value_prefix_url'] = $this->config->item("api_url_v2") . 'assessment/value/rater/' . $this->user->nip;
        $this->data['check_survey_url'] = $this->config->item("api_url_v2") . 'survey/check/rater/' . $this->user->nip;
        $this->data['submit_survey_url'] = $this->config->item("api_url_v2") . 'survey/submit/rater/' . $this->user->nip;
        $this->data['set_unrelevant_url'] = $this->config->item("api_url_v2") . 'assessment/set_unrelevant/rater/' . $this->user->nip;
        $this->data['revert_to_relevant_url'] = $this->config->item("api_url_v2") . 'assessment/revert_to_relevant/rater/' . $this->user->nip;

        // $this->load->view('user/assessment', $this->data);
        $this->load->view('webstrot/user/assessment', $this->data);
    }

    public function assessment_check()
    {
        $nip = $this->input->get('nip');
        if ($nip == null) {
            $nip = $this->user->nip;
        }

        $this->data['nip'] = $nip;
        $this->data['avatar_url'] = $this->config->item("api_url_v2") . 'user/avatar';
        $this->data['update_avatar_url_url'] = $this->config->item("api_url_v2") . 'user/update_avatar_url';
        $this->data['current_session_url'] = $this->config->item("api_url_v2") . 'session/current';
        $this->data['rateds_url'] = $this->config->item("api_url_v2") . 'assessment/rated/reset/true/rater/' . $nip;
        $this->data['all_statements_url'] = $this->config->item("api_url_v2") . 'statement/all';
        $this->data['all_statements_by_user_relation_url'] = $this->config->item("api_url_v2") . 'statement/all_by_user_relation';
        $this->data['post_value_prefix_url'] = $this->config->item("api_url_v2") . 'assessment/value/rater/' . $nip;
        $this->data['check_survey_url'] = $this->config->item("api_url_v2") . 'survey/check/rater/' . $nip;
        $this->data['submit_survey_url'] = $this->config->item("api_url_v2") . 'survey/submit/rater/' . $nip;

        // $this->load->view('user/assessment', $this->data);
        $this->load->view('webstrot/user/assessment_check', $this->data);
    }
    
    public function closed_hour() {
        $this->load->view('user/closed_hour');
    }
}
