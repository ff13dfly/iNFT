<?php
if(!defined('INFTADM')) exit('error');

//参数处理区域
if(!isset($_F['request']['id'])||!is_numeric($_F['request']['id'])) exit('wrong id');
$id=(int)$_F['request']['id'];

$a->load("bounty");
$a=Bounty::getInstance();

//1.数据获取部分
$bounty=$a->bountyView($id);

$bounty["detail"]=json_decode(htmlspecialchars_decode($bounty["detail"]),true);
$bounty["template"]=json_decode(htmlspecialchars_decode($bounty["template"]),true);
$bounty["apply"]=json_decode(htmlspecialchars_decode($bounty["apply"]),true);

$_F['data']=$bounty;

$a=Config::getInstance();
$a->tpl($_F['request']['mod'],$_F['request']['act'],$_F['pre'],$_F);