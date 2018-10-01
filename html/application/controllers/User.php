<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller {

    public function __construct() {
        parent::__construct();

        $this->load->database();        
        $this->load->helper('uuid');
        $this->load->helper('url_helper');
        $this->load->helper('assets');
        $this->load->helper('cookie');
        $this->load->helper('user');
        $this->load->library('user_agent');
    }

    public function register(){
        $message = isset($_COOKIE["analev_register_message"]) ? json_decode($_COOKIE["analev_register_message"]) : NULL;
        setcookie("analev_register_message", '', -7200, '/');
        
        // $message = array(
        //     'error' => (bool) (isset($_COOKIE["analev_register_error"]) ? $_COOKIE["analev_register_error"] : false), 
        //     'error_message' => isset($_COOKIE["analev_register_error_message"]) ? $_COOKIE["analev_register_error_message"] : '', 
        //     'email' => isset($_COOKIE["email"]) ? $_COOKIE["email"] : '', 
        //     'firstname' => isset($_COOKIE["firstname"]) ? $_COOKIE["firstname"] : '', 
        //     'lastname' => isset($_COOKIE["lastname"]) ? $_COOKIE["lastname"] : ''
        // );

        // setcookie("analev_register_error", $message['error'], -7200, '/');
        // setcookie("analev_register_error_message", $message['error_message'], -7200, '/');
        // setcookie("email", $message['email'], -7200, '/');
        // setcookie("firstname", $message['firstname'], -7200, '/');
        // setcookie("lastname", $message['lastname'], -7200, '/');

        $this->load->view('user/register', array(
            'message' => $message
        ));
    }

    public function cregister() {
        $email = $this->input->post('email');
        $password = $this->input->post('password');
        $firstname = $this->input->post('firstname');
        $lastname = $this->input->post('lastname');

        try {
            register_user($email, $password, $firstname, $lastname);

            setcookie("analev_login_message", json_encode(array(
                'type' => 'success', 
                'message' => "Congratulation, registration is success. Activate your account via link sent to " . $email . "."
            )), time() + 60, '/');

            redirect(base_url() . 'user/login', 'location');
        } catch(Exception $e) {
            setcookie("analev_register_message", json_encode(array(
                'type' => 'danger', 
                'message' => $e->getMessage()
            )), time() + 60, '/');

            // setcookie("analev_register_error", true, time() + 60, '/');
            // setcookie("analev_register_error_message", $e->getMessage(), time() + 60, '/');
            // setcookie("email", $email, time() + 60, '/');
            // setcookie("firstname", $firstname, time() + 60, '/');
            // setcookie("lastname", $lastname, time() + 60, '/');
            redirect(base_url() . 'user/register', 'location');
        }

        // setcookie("analev_register_error", false, time() + 60, '/');
        // setcookie("analev_register_message", 'An activation link is sent to ' . $email . '. Follow that link to activate your account.', time() + 60, '/');
    }
    
	public function login(){
        $next = $this->input->get('next', '');

        $message = isset($_COOKIE["analev_login_message"]) ? json_decode($_COOKIE["analev_login_message"]) : NULL;
        setcookie("analev_login_message", '', -7200, '/');

        // $message = array(
        //     'error' => isset($_COOKIE["analev_register_error"]) ? $_COOKIE["analev_register_error"] != NULL : false, 
        //     'message' => isset($_COOKIE["analev_register_message"]) ? $_COOKIE["analev_register_message"] : ''
        // );

        // setcookie("analev_register_error", $message['error'], -7200, '/');
        // setcookie("analev_register_message", $message['message'], -7200, '/');

        $data = array('next' => $next);
        if ($message != NULL) $data['message'] = (object) $message;

        $this->load->view('user/login', $data);
	}

    public function clogin() {
        $next = $this->input->post('next', '');
        $email = $this->input->post('email');
        $password = $this->input->post('password');

        $user = $this->db
            ->query('SELECT * FROM user_model WHERE email = ? AND password = ?', array($email, md5($password)))
            ->row();
        
        if ($user) {
            if ($user->active) {
                $now = time();
                $key = 'KDKE7483JJSDYF3489JSD793478382938489FJDSKF';
                $id = substr(str_replace("-", "", $user->id), 0, 9);
                $dt = strftime("%Y%m%d%H%M%S", $now);
                $rand = $this->_rand_str(20);
                $session = $id . $dt . '00000' . $rand;
                $hash = md5($session . $key);
                $cookie = $session . $hash;

                setcookie("CommunityBPS", $cookie, $now + 7200, '/');
            } else {
                setcookie("analev_login_message", json_encode(array(
                    'type' => 'danger', 
                    'message' => "Please activate your AnalevR account via the link sent to " . $user->email . " or <a href='" . base_url() . "user/cresent_activation?email=" . $user->email . "&next=" . $next . "'>Resent again</a>."
                )), time() + 60, '/');
            }
        } else {
            setcookie("analev_login_message", json_encode(array(
                'type' => 'danger', 
                'message' => "Invalid email and password."
            )), time() + 60, '/');
        }
        
        redirect(base_url() . $next, 'location');
    }

    public function cresent_activation() {
        $email = $this->input->get('email');
        $next = $this->input->post('next', '');

        if ($email != NULL) {
            sent_activation_link($email);

            setcookie("analev_login_message", json_encode(array(
                'type' => 'success', 
                'message' => "Activation link is sent to " . $email . "."
            )), time() + 60, '/');
        } else {
            setcookie("analev_login_message", json_encode(array(
                'type' => 'danger', 
                'message' => "Invalid email."
            )), time() + 60, '/');
        }

        redirect(base_url() . 'user/login?next=' . $next, 'location');
    }

    public function cactivate() {
        $id = $this->input->get('id');
        activate_user($id);

        setcookie("analev_login_message", json_encode(array(
            'type' => 'success', 
            'message' => "Your AnalevR account is activated."
        )), time() + 60, '/');

        redirect(base_url() . 'user/login', 'location');
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
