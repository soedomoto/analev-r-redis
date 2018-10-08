<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Webdis extends CI_Controller 
{

    public function __construct()
    {
        parent::__construct();

        $this->load->helper('url_helper');
        $this->load->helper('assets');
        $this->load->helper('cookie');
        $this->load->library('user_agent');
    }
    
    public function proxy()
    {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);

        $request = isset($_SERVER['ORIG_PATH_INFO']) ? '/' . $_SERVER['ORIG_PATH_INFO'] : $_SERVER['PATH_INFO'];
        $request = str_replace('/' . $this->router->fetch_class() . '/' . $this->router->fetch_method(), '', $request);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->config->item("webdis_url") . $request);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        if (isset($_SERVER['HTTP_COOKIE'])) curl_setopt($ch, CURLOPT_HTTPHEADER, array("Cookie: " . $_SERVER['HTTP_COOKIE']));
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 20);
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            curl_setopt($ch, CURLOPT_POST, TRUE);
            curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents("php://input"));
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: text/plain')); 
        }

        $response = curl_exec($ch);
        if ($response === false) {
            echo curl_error($ch);
            curl_close($ch);
            return;
        }

        $mime = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
        $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

        curl_close($ch);

        $header_text = substr($response, 0, $header_size);
        $body = substr($response, $header_size);

        foreach (explode("\r\n", $header_text) as $i => $line) {
            if ($i != 0 || $line != '') {
                header($line);
            }
        }

        echo $body;
    }
}
