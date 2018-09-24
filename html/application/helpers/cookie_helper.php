<?php 

if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}

if (! function_exists('get_user_from_cookie')) {
    function get_user_from_cookie() {
    	$CI =& get_instance();
        $CI->load->database();
        // $CI->load->helper('cookie');
    	
        if (isset($_COOKIE["CommunityBPS"])) {
            $key = "KDKE7483JJSDYF3489JSD793478382938489FJDSKF";
            $len_char   = strlen($_COOKIE["CommunityBPS"]) - 32;
            $sessionid  = substr($_COOKIE["CommunityBPS"], 0, $len_char);
            $nip   = substr($_COOKIE["CommunityBPS"], 0, 9);
            $hashkey    = substr($_COOKIE["CommunityBPS"], -32);

            if (md5($sessionid . $key) == $hashkey) {
                $user = $CI->db->query('SELECT * FROM user_model WHERE LEFT(REPLACE(id, "-", ""), 9) = ?', array($nip))->row();
                setcookie("CommunityBPS", $_COOKIE["CommunityBPS"], time() + 7200, '/');

                return $user;
            }
        }

        return NULL;
    }
}
