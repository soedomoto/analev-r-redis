<?php 

if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}

if (! function_exists('default_session')) {
    function default_session($user_id) {
        $CI =& get_instance();
        $CI->load->database();
        
        $session = $CI->db
            ->query('SELECT * FROM session_model WHERE user_id = ? AND is_default IS TRUE', array($user_id))
            ->row();

        if ($session == NULL) {
            $session = array(
                'id' => uuid_v4(), 
                'label' => 'Session', 
                'user_id' => $user_id, 
                'created_time' => date("Y-m-d H:i:s"), 
                'is_default' => TRUE
            );

            $CI->db->insert('session_model', $session); 
        }

        return $session;
    }
}