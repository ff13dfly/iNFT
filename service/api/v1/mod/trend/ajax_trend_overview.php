<?php
if(!defined('INFTAPI')) exit('error');

$result=array('success'=>FALSE);

$a->load('trend');
$a=Trend::getInstance();

$result['limit']=$a->trendOverview();
$result['success']=true;

$a=Config::getInstance();
$a->export($result);