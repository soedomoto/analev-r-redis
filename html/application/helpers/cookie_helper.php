<?php 

if (! defined('BASEPATH')) {
    exit('No direct script access allowed');
}

if (! function_exists('get_user_from_cookie')) {
    function get_user_from_cookie() {
    	$CI =& get_instance();
    	
        if (isset($_COOKIE["CommunityBPS"])) {
            $key = "KDKE7483JJSDYF3489JSD793478382938489FJDSKF";
            $len_char   = strlen($_COOKIE["CommunityBPS"]) - 32;
            $sessionid  = substr($_COOKIE["CommunityBPS"], 0, $len_char);
            $nip   = substr($_COOKIE["CommunityBPS"], 0, 9);
            $hashkey    = substr($_COOKIE["CommunityBPS"], -32);

            if (md5($sessionid . $key) == $hashkey) {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $CI->config->item("api_url_v2") . '/user/info/nip/' . $nip);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                
                $resp = curl_exec ($ch);
                if ($resp === FALSE)
                    throw new Exception(curl_error($ch), curl_errno($ch));
                curl_close($ch);

                $resp = json_decode($resp);
                return $resp->data;
            }
        }

        return NULL;
    }
}
