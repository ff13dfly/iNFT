<?php
if(!defined('INFTAPI')) exit('error');

$page=isset($_F['request']['page'])?(int)$_F['request']['page']-1:0;
$account=$_F['request']['acc'];

$result=array('success'=>FALSE);

$a->load('cache');
$a=Cache::getInstance();

$key=REDIS_PREFIX_ACCOUNT.$account;

$step=12;
$start=$page*$step;
$end=$start+$step-1;
$queue=$a->rangeList($key,$start,$end);

$map=array();
foreach($queue as $v){
    $raw=$a->getKey($v);
    $data=json_decode($raw,true);
    $tmp=explode("_",$v);
    $block=array_pop($tmp);

    array_shift($tmp);
    $name=implode("_",$tmp);

    $data['name']=$name;
    $data['block']=(int)$block;

    array_push($map,$data);
}

$result['data']=$map;
$result['success']=true;

$a=Config::getInstance();
$a->export($result);