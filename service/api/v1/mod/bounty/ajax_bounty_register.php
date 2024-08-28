<?php
if(!defined('INFTAPI')) exit('error');

$name=$_F['request']['alink'];

$result=array('success'=>FALSE);

$a->load("bounty");
$a=Bounty::getInstance();

//1.check the bounty
$bt=$a->bountySearch($name);
if(!empty($bt)){
    $a=Config::getInstance();
    $a->error("Bounty exsist.");
}

$data=array(
    "alink"     =>  $name,
    "announce"  =>  "{}",
    "coin"      =>  "",
    "raw"       =>  "{}",
    "payment"   =>  "",
    "apply"     =>  "[]",
    "applied"   =>  0,                      //wether accepted by manager
    "status"    =>  BOUNTY_STATUS_OK,
);

if(!$a->bountyAdd($data)){
    $a=Config::getInstance();
    $a->error('Failed to add bounty.');
}

$result["alink"]=$name;
$result["success"]=true;

$a=Config::getInstance();
$a->export($result);

