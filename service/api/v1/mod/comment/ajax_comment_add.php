<?php
if(!defined('INFTAPI')) exit('error');
$page=isset($_F['request']['p'])?(int)$_F['request']['p']-1:0;

$result=array('success'=>FALSE);


$a->load("comment");
$a=Comment::getInstance();

$result['success']=true;


$a=Config::getInstance();
$a->export($result);

