<?php
	class Connect extends CORE{
		private static $config=array(
			'basic_table'	=>	'connect',
			'page_count'=>	0,
		);
		
	    //必须，数据库加载启动 
	 	public function __construct(){CORE::dbStart();}
		public function __destruct(){CORE::dbClose();}
		public static function getInstance($count){
			self::$config['page_count']=$count;
			return CORE::init(get_class());
		}

		public function getStep(){
			return self::$config['page_step'];
		}
		
		public function connectCreate($mod_a,$mod_b){
			$tba=PRE.CONNECT_BASIC_TABLE;
			$tbb=PRE.$mod_a.'_'.$mod_b;
			$sql = 'create table if not exists ' . $tbb . ' like ' . $tba;
			if(!$this->query($sql))	return FALSE;
			return TRUE;
		}
		
		public function connectShow($mod_a,$mod_b,$id){
			$table=PRE.$mod_a.'_'.$mod_b;
			$where='id';
			$data=array();
			$data['mtime']=time();
			$data['status']=1;
			return $this->update($data, $table, $where, $id);	
		}
		
		public function connectClose($mod_a,$mod_b,$id){
			$table=PRE.$mod_a.'_'.$mod_b;
			$where='id';
			$data=array();
			$data['mtime']=time();
			$data['status']=0;
			return $this->update($data, $table, $where, $id);	
		}
		
		public function connectAdd($mod_a,$mod_b,$data){
			$table=PRE.$mod_a.'_'.$mod_b;
			$stamp=time();
			$data['mtime']=$stamp;
			$data['ctime']=$stamp;
			return $this->insert($data, $table);
		}
		
		public function connectView($mod_a,$mod_b,$id){
			$table=PRE.$mod_a.'_'.$mod_b;
			$where='id';
			$arr=$this->select($table,$where,$id);
			return empty($arr)?FALSE:$arr[0];
		}
		
		
		public function connectCheck($mod_a,$mod_b,$aid,$bid){
			$table=PRE.$mod_a.'_'.$mod_b;
			$where='`aid`='.$aid.' AND `bid`';
			$arr=$this->select($table,$where,$bid);
			if(empty($arr)){
				return false;
			}else{
				return $arr[0];
			}
		}
		
		public function connectUpdate($mod_a,$mod_b,$data,$id){
			$table=PRE.$mod_a.'_'.$mod_b;
			$where='id';
			$data['mtime']=time();
			return $this->update($data, $table, $where, $id);
		}
		
		public function connectList($mod_a,$mod_b,$page=0,$warr=array(),$order='ctime'){
			$table=PRE.$mod_a.'_'.$mod_b;
			$count=self::$config['page_count'];
			$where='';
			if(!empty($warr))foreach($warr as $k=>$v)$where.="`".$k."`='".$v."' AND ";
			$where=trim($where,'AND ');
			return $this->fuuList($table,$page,$count,true,$where,$order);
		}
		
		public function connectPages($mod_a,$mod_b,$warr=array()){
			$table=PRE.$mod_a.'_'.$mod_b;
			$count=self::$config['page_count'];
			$where='';
			if(!empty($warr))foreach($warr as $k=>$v)$where.="`".$k."`='".$v."' AND ";
			$where=trim($where,'AND ');
			return $this->pages($table,'id',$where,$count);
		}
	}