<?php
if(!defined('INFTADM')) exit('error');

$id=(int)$_F['request']['id'];           //bounty anchor link


$result=array('success'=>FALSE);

$a->load("bounty");
$a=Bounty::getInstance();

$bounty=$a->bountyView($id);
if(empty($bounty)){
    $a=Config::getInstance();
    $a->error("No such bounty.");
}

$data=array(
    "applied" => 0,
);

if(!$a->bountyUpdate($data,$id)){
    $a=Config::getInstance();
    $a->error("Failed to update apply");
}

//2. get bounty list
//2.get the bounty list on-line;
$warr=array(
    "applied" => 1
);
$param=$a->bountyPages($warr);
$list=$a->bountyList(0,$warr,'id',true,$param["sum"]);
$bounty=array();
foreach($list as $v){
    $bounty[]=$v["alink"];
}

$result["nav"]=$param;
$result["list"]=$bounty;

$result["success"]=true;

$a=Config::getInstance();
$a->export($result);

