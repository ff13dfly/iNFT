<?php
/*数据库设置*/
define ('LOG',	'zloga');			//日志表
define ('HLOG',	'zhacka');			//黑客行为表


//MVC的基础定义部分
define('PATH_MODULE',		'lib');
define('PATH_CONTROLLER',	'mod');
define('PATH_VIEW',			'view');
define('SUFFIX_MODULE',		'.class.php');
define('SUFFIX_CONTROLLER',	'.php');
define('SUFFIX_VIEW',		'.tpl');

//controller区分不同的数据请求s
define('CON_WEB',		'web_');
define('CON_AJAX',		'ajax_');

define('DEFAULT_ADMIN_EXPIRE', 300);

define('DEFAULT_MOD',	'hack');
define('DEFAULT_ACT',	'list');

define('DEFALT_WORLD',0);
define('MIN_X',1);		//世界的X边长
define('MIN_Y',1);		//世界的Y边长
define('MAX_X',4096);		//世界的X边长
define('MAX_Y',4096);		//世界的Y边长
define('MIN_WORLD',0);		//世界的Y边长
define('MAX_WORLD',1024);		//世界的Y边长
define('WORLD_SIDE_LENGTH',16);		//Block的边长
define('DEFAULT_UUID','2b5d09d6-bcf7-1ecb-c223-65d738105e4b');		//Block的边长

//默认规则，值约大约危险
define('ERROR_LEVEL_1',	1);
define('ERROR_LEVEL_2',	2);
define('ERROR_LEVEL_3',	3);
define('ERROR_LEVEL_4',	4);
define('ERROR_LEVEL_5',	5);
define('ERROR_LEVEL_6',	6);
define('ERROR_LEVEL_7',	7);
define('ERROR_LEVEL_8',	8);
define('ERROR_LEVEL_9',	9);
define('ERROR_LEVEL_10',10);