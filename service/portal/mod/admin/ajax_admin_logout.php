<?php
if(!defined('WDD')) exit('error');

unset($_SESSION['admin']);
unset($_SESSION['name']);
unset($_SESSION['uid']);

$result['success']=true;

$a=Config::getInstance();
$a->export($result);