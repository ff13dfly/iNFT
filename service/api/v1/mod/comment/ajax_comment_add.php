<?php
if(!defined('INFTAPI')) exit('error');

$alink=$_F['request']['bounty'];
$address=$_F['request']['address'];
$memo=$_F['request']['memo'];

$result=array('success'=>FALSE);

//1.check bounty
$a->load("bounty");
$a=Bounty::getInstance();

if(!$a->bountyExsist($alink)){
    $a=Config::getInstance();
    $a->error("No such bounty");
}

$a->load("comment");
$a=Comment::getInstance();

$data=array(
    "bounty"    =>  $alink,
    "address"   =>  $address,
    "memo"      =>  $memo,
    "status"    =>  COMMENT_STATUS_OK,
);

if(!$a->commentAdd($data)){
    $a=Config::getInstance();
    $a->error("Failed to add comment.");
}

$result['success']=true;

$a=Config::getInstance();
$a->export($result);