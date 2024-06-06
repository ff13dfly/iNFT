<?php
if(!defined('WDD')) exit('error');

//参数处理区域
$page=isset($_F['request']['p'])?(int)$_F['request']['p']-1:0;

$a->load('board');
$a=Board::getInstance();

//1.数据获取部分
$warr=array();
$warr[]=array('status','<>',BOARD_STATUS_DEL);

$param=$a->boardPages($warr);
if($page>=$param['total'] && $param['total']!=0){
	$a=Config::getInstance();
	$a->error('wrong page');
}

$desc=isset($_F['request']['dc'])?$_F['request']['dc']:TRUE;
$otag=isset($_F['request']['od'])?$_F['request']['od']:'id';
$order=$a->transOrder($otag);
$arr=$a->boardList($page,$warr,$order,$desc);
$_F['list']=$arr;

$_F['dec']=$desc;
$_F['title']='留言管理';

//分页计算部分
$step=$a->getStep();
$a=Config::getinstance();
if($param['total']!=0){
	$url='?mod=board&act=list';
	$url.='&od='.$otag;
	$url.='&dc='.$desc;
	$url.='&p=';
	$nav=$a->pagination($param['total'],$page,$url,$step);
	$_F['nav']=$nav;
}else{
	$_F['nav']='';
}

$a=Config::getInstance();
$a->tpl($_F['request']['mod'],$_F['request']['act'],$_F['pre'],$_F);