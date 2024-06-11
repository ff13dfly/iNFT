<?php
if(!defined('INFTAPI')) exit('error');

//get templates of iNFT market

$page=isset($_F['request']['p'])?(int)$_F['request']['p']-1:0;
$tpl=$_F['request']['tpl'];

$result=array('success'=>FALSE);

$a->load('cache');
$a=Cache::getInstance();

$map=$a->getGlobalList(REDIS_QUEUE_TEMPLATE,0,20);

$result['data']=$map;
$result['success']=true;

$a=Config::getInstance();
$a->export($result);