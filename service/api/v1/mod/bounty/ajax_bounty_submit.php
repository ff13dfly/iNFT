<?php
if(!defined('INFTAPI')) exit('error');

$name=$_F['request']['name'];
$hash=$_F['request']['hash'];
$result=array('success'=>FALSE);

$result["anchor"]=$name;
$result["hash"]=$hash;

$a=Config::getInstance();
$a->export($result);

