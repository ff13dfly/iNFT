<?php
if(!defined('INFTADM')) exit('error');


if(!isset($_F['request']['address'])) exit('wrong id');
$acc=$_F['request']['address'];
$start=0;
$end=100;

$result=array('success'=>FALSE);

$a->load('inft');
$a=Inft::getInstance();

$key=INFT_PREFIX_ACCOUNT.$acc;

$arr=$a->rangeList($key,$start,$end);

$result['address']=$acc;
$result['data']=$arr;
$result['success']=true;

$a=Config::getInstance();
$a->export($result);