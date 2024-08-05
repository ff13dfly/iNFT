<?php
if(!defined('INFTADM')) exit('error');

//parameters
if(!isset($_F['request']['id'])||!is_numeric($_F['request']['id'])) exit('wrong id');
$id=(int)$_F['request']['id'];

$a->load("bounty");
$a=Bounty::getInstance();

//1.get the bounty details
$bounty=$a->bountyView($id);

$bounty["detail"]=json_decode(htmlspecialchars_decode($bounty["detail"]),true);
$bounty["template"]=json_decode(htmlspecialchars_decode($bounty["template"]),true);
$bounty["apply"]=json_decode(htmlspecialchars_decode($bounty["apply"]),true);

//2.status data

$_F['status']=array(
    BOUNTY_APPLY_SUBMITTED  => "Submitted",
    BOUNTY_APPLY_APPROVED  => "Waiting for distributing",
    BOUNTY_APPLY_FAILED  => "Invalid apply",
    BOUNTY_APPLY_PAYED  => "Distributed",
);

$_F['data']=$bounty;

$a=Config::getInstance();
$a->tpl($_F['request']['mod'],$_F['request']['act'],$_F['pre'],$_F);