<?php
if(!defined('INFTAPI')) exit('error');

$name=$_F['request']['name'];
$result=array('success'=>FALSE);

$result["anchor"]=$name;


$result["success"]=true;
$a=Config::getInstance();
$a->export($result);

