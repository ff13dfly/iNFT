<?php
if(!defined('INFTAPI')) exit('error');

$name=$_F['request']['name'];

$result=array('success'=>FALSE);


$key="acc_5GnWZEWmWTjcP2Qb6jCA6eQJPfm2Mqnk2tMhzmG8LuxFb84J";
$start=0;
$end=20;
$queue=$a->getGlobalList($key,$start,$end);

$map=array();
foreach($queue as $v){
    $raw=$a->getKey($v);
    $data=json_decode($raw,true);
    $data['name']=$v;
    array_push($map,$data);
}

$result['data']=$map;
$result['success']=true;

$a=Config::getInstance();
$a->export($result);