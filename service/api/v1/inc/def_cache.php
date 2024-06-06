<?php
/*通用统一前缀处理*/
define('GLOBAL_PRE_HACK',		'hk_');
define('GLOBAL_PRE_SPAM',		'spam_');
define('GLOBAL_PRE_USER',		'usr_');

//共享的redis缓存，保存公用的分类等基础信息
define('GLOBAL_REIDS_HOST',	'127.0.0.1');
define('GLOBAL_REIDS_PORT',	6379);
define('GLOBAL_REIDS_AUTH',	'');
define('GLOBAL_REIDS_TIMEOUT',	3600);

//只支持kv实现，不支持hash，list等复杂类型，纯当缓存用
define('CACHE_REIDS_HOST',		'127.0.0.1');
define('CACHE_REIDS_PORT',		6379);
define('CACHE_REIDS_AUTH',		'authKEY');
define('CACHE_REIDS_TIMEOUT',	3600);