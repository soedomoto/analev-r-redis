<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller {

    public function __construct() {
        parent::__construct();

        $this->load->database();
        $this->load->helper('url_helper');
        $this->load->helper('assets');
        $this->load->helper('cookie');
        $this->load->library('user_agent');
    }
    
	public function login(){
        $next = $this->input->get('next', '');
        $this->load->view('user/login', array(
            'next' => $next
        ));
	}

    public function clogin() {
        $next = $this->input->post('next', '');
        $email = $this->input->post('email');
        $password = $this->input->post('password');

        $user = $this->db
            ->query('SELECT * FROM user_model WHERE email = ? AND password = ?', array($email, md5($password)))
            ->row();
        
        if ($user) {

            $now = time();
            $key = 'KDKE7483JJSDYF3489JSD793478382938489FJDSKF';
            $id = substr(str_replace("-", "", $user->id), 0, 9);
            $dt = strftime("%Y%m%d%H%M%S", $now);
            $rand = $this->_rand_str(20);
            $session = $id . $dt . '00000' . $rand;
            $hash = md5($session . $key);
            $cookie = $session . $hash;

            setcookie("CommunityBPS", $cookie, $now + 7200, '/');
        }
        
        redirect(base_url() . $next, 'location');
    }

    public function clogout() {
        setcookie("CommunityBPS", $cookie, -7200, '/');
        redirect(base_url() . $next, 'location');
    }

    function _rand_str($length = 6) {
        $str = "";
        $characters = array_merge(range('A','Z'));
        $max = count($characters) - 1;
        for ($i = 0; $i < $length; $i++) {
            $rand = mt_rand(0, $max);
            $str .= $characters[$rand];
        }
        return $str;
    }
}
