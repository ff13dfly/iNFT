<?php
if(!defined('INFTAPI')) exit('error');
$page=isset($_F['request']['p'])?(int)$_F['request']['p']-1:0;
$alink=$_F['request']['bounty'];

$result=array('success'=>FALSE);

$a->load("comment");
$a=Comment::getInstance();

$warr=array(
    "bounty" => $alink,
);
$list=$a->commentList($page,$warr);

$result['data']=$list;
$result['success']=true;

$a=Config::getInstance();
$a->export($result);

