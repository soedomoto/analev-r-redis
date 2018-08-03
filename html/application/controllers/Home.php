<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller 
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
        $this->load->view('home/index');
	}

    public function login() {
        $this->load->library('session');
        
        try {
            $username = $this->input->post("username");
            $username = str_replace('@bps.go.id', '', $username);
            $username = str_replace('@mail.bps.go.id', '', $username);
            $username = str_replace('@mailhost.bps.go.id', '', $username);
            
            $password = $this->input->post("password");
            $next = $this->input->get("next");

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $this->config->item("api_url_v2") . '/user/authenticate');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, 2);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array('username' => $username, 'password' => $password)));
            
            $resp = curl_exec ($ch);
            if ($resp === FALSE)
                throw new Exception(curl_error($ch), curl_errno($ch));

            curl_close($ch);

            $resp = json_decode($resp);
            if ($resp->success == '1') {
                $user = $resp->data;
                $this->session->user = $user;
                
                if ($next) {
                    $fallback_url = base_url() . $next;
                    redirect($fallback_url, 'location');
                    return;
                }

                $fallback_url = $this->input->post('redirect') ?: $this->agent->referrer() ?: $this->agent->referrer();
            
                if ($fallback_url != NULL) {
                    $fallback_url .= isset($user->roles) ? (sizeof($user->roles) > 0 ? 
                            $user->roles[0]->fallback_page : '') : '';

                    redirect($fallback_url, 'location');
                } else {
                    $this->response(array(
                        'success' => TRUE,
                        'message' => 'No redirect url defined. Type url manually', 
                        'data' => array(), 
                    ), REST_Controller::HTTP_OK);
                }
            } else {
                $message = $resp->message;
                echo $message . '<br/>' . 'Redirecting to home page...';
                echo "<script>setTimeout(\"location.href = '" . base_url() . "';\",1500);</script>";
            }
        } catch (Exception $e) {
            echo sprintf('Error in fulfilling request. Message : %s', $e);
        }
    }

    public function logout() {
        setcookie('CommunityBPS', $_COOKIE["CommunityBPS"], time() - (3600 * 24), '/', '.bps.go.id');
        setcookie('CommunityBPSUser', $_COOKIE["CommunityBPSUser"], time() - (3600 * 24), '/', '.bps.go.id');
        // unset($_COOKIE['CommunityBPS']);
        redirect(base_url(), 'location');
    }
}
