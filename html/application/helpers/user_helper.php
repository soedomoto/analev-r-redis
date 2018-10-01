<?php 

if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}

if (! function_exists('register_user')) {
    function register_user($email, $password, $firstname, $lastname) {
    	$CI =& get_instance();
        $CI->load->database();
        // $CI->load->helper('cookie');
    	
        $user = $CI->db
            ->query('SELECT * FROM user_model WHERE email = ?', array($email))
            ->row();

        if ($user != null) throw new Exception('Email ' . $email . ' has already taken. Please take another email address.');

        // Insert
        $id = uuid_v4();
        $CI->db->insert('user_model', array(
            'id' => $id, 
            'fullname' => $firstname . ' ' . $lastname, 
            'email' => $email, 
            'password' => md5($password), 
            'active' => FALSE
        )); 
        
        // Send activation mail
        sent_activation_link($email);
    }
}

if (! function_exists('sent_activation_link')) {
    function sent_activation_link($email) {
        $CI =& get_instance();
        $CI->load->database();
        // $CI->load->helper('cookie');
        
        $user = $CI->db
            ->query('SELECT * FROM user_model WHERE email = ?', array($email))
            ->row();
        
        // Send activation mail
        $emailConfig = [
            'protocol' => 'smtp', 
            'smtp_host' => 'ssl://smtp.googlemail.com', 
            'smtp_port' => 465, 
            'smtp_user' => 'user.analev.r@gmail.com', 
            'smtp_pass' => 'python.r', 
            'mailtype' => 'html', 
            'charset' => 'iso-8859-1'
        ];
        // Set your email information
        $from = [
            'email' => 'user.analev.r@gmail.com',
            'name' => 'AnalevR'
        ];
       
        $to = array($email);
        $subject = 'Activation Link';
        $message =  'Welcome to AnalevR, ' . $user->firstname . ' ' . $user->lastname . '.\r\n' . 
                    '\r\n' . 
                    'In order to use AnalevR, You must activate your account through <a href="' . base_url() . 'user/cactivate?id=' . $user->id . '">this activation link</a>'; 

        $CI->load->library('email', $emailConfig);
        $CI->email->set_newline("\r\n");
        $CI->email->from($from['email'], $from['name']);
        $CI->email->to($to);
        $CI->email->subject($subject);
        $CI->email->message($message);
        if (!$CI->email->send()) {
            throw new Exception('Registration failed. ' . $CI->email->print_debugger());
        }
    }
}

if (! function_exists('activate_user')) {
    function activate_user($id) {
        $CI =& get_instance();
        $CI->load->database();
        // $CI->load->helper('cookie');

        $CI->db->update('user_model', array('active' => true), array('id' => $id));
    }
}
