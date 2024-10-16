<?php
if(!defined('INFTAPI')) exit('error');
$page=isset($_F['request']['page'])?(int)$_F['request']['page']:0;


$result=array('success'=>FALSE);

$a->load("bounty");
$a=Bounty::getInstance();
$step=isset($_F['request']['step'])?(int)$_F['request']['step']:BOUNTY_PAGE_STEP;

$warr=array(
    "applied"    =>  1,
);

$arr=$a->bountyList($page,$warr,'id',true,$step);
if(!empty($arr)){
    foreach($arr as $k=>$v){
        //$arr[$k]['detail']=json_decode(htmlspecialchars_decode($v["detail"]),true);
        //$arr[$k]['template']=json_decode(htmlspecialchars_decode($v["template"]),true);
        $arr[$k]['apply']=json_decode(htmlspecialchars_decode($v["apply"]),true);
        unset($arr[$k]["id"]);
    }
}

$result['data']=$arr;
$result['success']=true;

$a=Config::getInstance();
$a->export($result);

