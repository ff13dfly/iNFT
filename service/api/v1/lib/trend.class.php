<?php
	class Trend extends CORE{		
	    //必须，数据库加载启动 
	 	public function __construct(){CORE::dbStart();}
		public function __destruct(){CORE::dbClose();}
		public static function getInstance(){return CORE::init(get_class());}
		
		public function getStep(){
			return TREND_PAGE_STEP;
		}

		public function trendOverview(){
			$key=TREND_SYSTEM_STATUS;
			$json=$this->getKey($key);
			return json_decode($json,true);
		}

		public function trendChart($start,$step){
			$arr=array();
			for($i=0;$i<$step;$i++){
				$block=$start-$i;
				$amount=$this->lenList(TREND_PREFIX_BLOCK.$block);
				$arr[]=array($block,$amount);
			}
			return $arr;
		}
	}