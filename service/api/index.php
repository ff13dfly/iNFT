<?php

date_default_timezone_set('Asia/Shanghai');			//设置时区，不然date会按照标准日期进行计算

$ver=isset($_GET['ver'])&&is_numeric($_GET['ver'])?'v'.$_GET['ver']:'v1';
$basic=$ver.DIRECTORY_SEPARATOR.'inc'.DIRECTORY_SEPARATOR.'basic.php';
if(!file_exists($basic)) exit('wrong request');
include $basic;

if(SHUTDOWN) exit('server is shutdown');
if(DEBUG){
	global $yhf;
	$yhf['ms']=microtime(true);
	$yhf['query']=0;
	$yhf['redis']=0;
}

include $ver.DS.'lib'.DS.'core.class.php';
include $ver.DS.'lib'.DS.'config.class.php';

$a=Config::getInstance();

$_F=$a->configEnv($ver);

include $_F['target'];