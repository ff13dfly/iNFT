<?php
if(!defined('INFTAPI')) exit('error');

$alink=$_F['request']['name'];
$result=array('success'=>FALSE);

$a->load("bounty");
$a=Bounty::getInstance();

$data=$a->bountySearch($alink);

if(empty($data)){
    $a=Config::getInstance();
    $a->error("No such bounty.");
}

$data['apply']=json_decode(htmlspecialchars_decode($data['apply']),true);
$data['template']=json_decode(htmlspecialchars_decode($data['template']),true);
unset($data["id"]);

$result["data"]=$data;
$result["success"]=true;

$a=Config::getInstance();
$a->export($result);

