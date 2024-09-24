<?php
if(!defined('INFTAPI')) exit('error');

$start=(int)$_F['request']['start']; 
$step=(int)$_F['request']['step']; 

$result=array('success'=>FALSE);


$a->load('trend');
$a=Trend::getInstance();

$result['data']=$a->trendChart($start,$step);
$result['success']=true;

$a=Config::getInstance();
$a->export($result);