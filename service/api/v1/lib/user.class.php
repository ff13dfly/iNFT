<?php
	class User extends CORE{
		
	    //必须，数据库加载启动 
	 	public function __construct(){CORE::dbStart();}
		public function __destruct(){CORE::dbClose();}
		public static function getInstance(){return CORE::init(get_class());}
		
		//以uuid来记录的数据
		private $structUser=array(
			'token'		=>	'',			//用户令牌
			'uid'			=>	0,			//注册用户的uid
			'regIP'		=>	'',			//注册IP	
			'lastIP'		=>	0,			//
			'ctime'		=>	0,			//创建时间
			'origin'		=>	0,			//uuid注册来源
			'last'			=>	0,			//获取token请求时间，防止token过期
			'count'		=>	0,			//请求token的次数
			'IPs'			=>	'',			//历史访问过的IP地址及时间戳json
			'log'			=>	'',			//登陆日志，暂时不用
			'x'				=>	0,			//最后一次的IP
			'y'				=>	0,			//最后一次的IP
			'world'		=>	0,			//用户的所在的世界编号
			'death'		=>	0,			//用户死亡时间
		);
		
		//处理公共user信息的缓存
		public function userCache($uuid){
			$user=$this->userView($uuid,FALSE);
			if(empty($user)) return FALSE;
			$key=GLOBAL_PRE_USER.$user['uid'];
			return $this->autosetGlobalHash($key,array(
				'name'	=>	$user['name'],
				'uuid'	=>	$user['uuid'],
				'birth'	=>	$user['birth'],
				'world'	=>	$user['world'],
				'sign'	=>	$user['sign'],
				'thumb'=> 	$user['thumb'],  
			));	
		}
		
		/*生成用户的uuid的操作，带基本的防护
		 * @param	$og	integer		//注册来源
		 * return
		 * array('uuid'=>$uuid,'token'=>$token,'uid'=>$uid)
		 * */
		public function userUUID($og){
			$ip=$_SERVER['REMOTE_ADDR'];
			$key=GLOBAL_PRE_HACK.$ip;
			$dkey=USER_DDOS_STAMP_PRE.$ip;			//记录IP上次访问时间的记录
			$time=time();
				
			//1.检测最近的访问时间,如果小于访问间隔,直接停止响应
			if($this->existsKey($dkey)){						
				$stamp=$this->getKey($dkey);
				if($time-(int)$stamp<USER_DDOS_INTERVAL){		//封IP的时间为USER_DDOS_INTERVAL
					return DEBUG?$stamp:'ddos attemp';
				}
			}
			
			//2.累计检测时间,在USER_FRESH_INTERVAL指定时间内最大访问次数为USER_FRESH_MAX
			$ttl=$this->ttlKey($key);
			if($ttl==-1){			//不存在累计访问限制,进行+1处理
				$this->incKey($key);
				$this->expireKey($key,USER_FRESH_INTERVAL);
			}else{
				$count=$this->getKey($key);
				if((int)$count>USER_FRESH_MAX){
					$dkey=USER_DDOS_STAMP_PRE.$ip;
					$this->setKey($dkey,$time);
					return 'block';
				}
				$this->incKey($key);
			}
			
			//保存用户数据
			$uuid=$this->uuid();
			$token=$this->token();
			
			$info=$this->structUser;
			$info['token']	=$token;
			$info['regIP']	=$ip;
			$info['lastIP']	=$ip;
			$info['last']		=$time;
			$info['ctime']	=$time;
			$info['origin']	=$og;
			$info['IPs']		=json_encode(array($ip));

			$uid=$this->userDBSave($uuid,$info);
			if(!$uid) return false;
			$info['uid']=$uid;
			$this->autosetGlobalHash($uuid, $info);
			
			//$this->userCount();			//放弃统计,都存数据库了
			
			return array('uuid'=>$uuid,'token'=>$token,'uid'=>$uid);	
		}


		/*生成用户的tag,可以显式的传递给url,实现同步登陆
		 * @param	$uuid	string	//唯一的用户uuid
		 * @param	$token	string	//用户认证token
		 * return
		 * 1.返回spam,根据spam可以取登录信息
		 * */
		public function userSpam($uuid,$token){
			//1.检测token是否合法
			$user=$this->getGlobalHash($uuid,array('token','last'));
			
			if($user['token']==FALSE) return USER_ERROR_NO_UUID;					//不存在uuid的错误情况
			if($user['token']!=$token) return USER_ERROR_WRONG_TOKEN;		//token错误的情况
			
			//2.token长时间未用过期
			$time=time();
			if($time-(int)$user['last']>GLOBAL_TOKEN_EXPIRE) return FALSE;
			
			//3.更新用户最后登录时间
			$this->setGlobalHash($uuid,'last',$time);	//更新token的寿命
			
			$spam=$this->spam();					//生成新的spam
			$salt=$this->salt();							//生成新的salt，用于和IP进行验证
			$ip=$_SERVER['REMOTE_ADDR'];
			
			//4.准备spam的数据，保存到redis并设置好过期
			$key=GLOBAL_PRE_SPAM.$spam;
			$info=array(
				'uuid'	=>$uuid,
				'uid'		=>$this->getUid($uuid),
				'IP'		=>$ip,
				'salt'		=>$salt,
				'md5'	=>$this->encrySpam($ip,$salt),
			);
			$this->autosetGlobalHash($key, $info);
			$this->setGlobalExp($key,GLOBAL_SPAM_EXPIRE);
			
			return $spam;
		}
		
		public function freshSpam($spam){
			$key=GLOBAL_PRE_SPAM.$spam;
			if(!$this->existsGlobalKey($key)) return FALSE;
			return $this->setGlobalExp($key,GLOBAL_SPAM_EXPIRE);
		}
		
		public function getSpam($spam){
			$key=GLOBAL_PRE_SPAM.$spam;
			return $this->getGlobalHash($key);
		}
		
		private function getUid($uuid){
			$info=$this->getGlobalHash($uuid, array('uid'));
			return (int)$info['uid'];
		}
		
		private function encrySpam($ip,$salt){
			return md5($salt.$ip.$salt);
		}
		
		public function tokenFresh($uuid){
			$user=$this->getGlobalHash($uuid,array('token','last'));
			$time=time();
			if($time-(int)$user['last']<GLOBAL_TOKEN_EXPIRE) return FALSE;
			return $this->setGlobalHash($uuid,'last',$time);
		}
		
		
		public function userReg($uuid,$mobile,$pass){
			$u=$this->userView($uuid,FALSE);			//false是取原始数据，不过滤
			if(empty($u)) return FALSE;
			
			$data=array(
				'mobile'	=>	$mobile,
				'pass'		=>	$pass,
				'status'		=>	USER_STATUS_OK,
				'name'		=>	$mobile,
			);
			return $this->userUpdate($data, $u['uid']);
		}
		
		public function userView($uuid,$filter=true){
			$table=PRE.'user';
			$where='uuid';
			$arr=$this->select($table,$where,$uuid);
			if(empty($arr)) return FALSE;
			return $filter?$this->userExport($arr[0]):$arr[0];
		}
		
		/*输出用户的信息数组，去除不需要的信息*/
		public function userExport($user){
			//echo json_encode($user);
			return array(
				'uid'=>			(int)$user['uid'],
				'name'=>		$user['name'],
				'sex'=>			(int)$user['sex'],
				'coin'=>		(float)$user['coin'],
				'block'=>		(int)$user['blocks'],
				'fav'=>			(int)$user['fav'],
				'email'=>		$user['email'],
				'mobile'=>	$user['mobile'],
				'email'=>		$user['email'],
				'sign'	=>	$user['sign'],
				//'salt'	=>		$user['salt'],
				'status'	=>	(int)$user['status'],
				'isReg'=>	$user['pass']==USER_UNPASS?FALSE:TRUE,
			);
		}
		
		public function userRecover(){
			
			
		}
		
		public function userPassReset(){
			
		}
		
		public function userUpdate($data,$id){
			$table=PRE.'user';
			$where='uid';
			$data['mtime']=time();
			return $this->update($data, $table, $where, $id);
		}
		
		public function setUserMobile($uuid,$mobile){
			$this->setGlobalHash($uuid, 'mobile',$mobile);
			return TRUE;
		}
		
		public function lastLogin($uuid,$stamp){
			$this->setGlobalHash($uuid, 'last',$stamp);
			return $stamp;
		}
		
		public function getUser($val,$type=1){
			$table=PRE.'user';
			if($type==1)$where='uid';
			if($type==2)$where='name';
			if($type==3)$where='phone';
			if($type==4)$where='mail';
			$user=$this->select($table,$where,$val);
			return empty($user)?FALSE:$user[0];
		}
		
		public function checkPass($user,$pass){
			$uu=$this->getUser($user,2);
			if(empty($uu)) return FALSE;
			
			$hash=$this->hashPass($pass,$uu['ctime']);
			return $hash==$uu['pass']?$uu:FALSE;
		}
		

		
		
		
		//密码加密的方法
		public function hashPass($pass,$time,$salt){
			return md5(USER_PASS_SALT.md5($pass).$time);
		}
		
		private function token(){
			return md5(microtime().uniqid());
		}
		
		//***************短信处理部分*****************/
		
		public function sent($mobile,$len=6){
			$this->load('sms');
			$sms=Sms::getInstance();
			//$sms->setRequestType('curl');
			$sms->setRequestType();		//默认的短信获取方式
			$rst=$sms->sendSmsCode($mobile);
			
			
			$vcode=$rst['obj'];
			if($this->setMobileVcode($vcode,$mobile)){
				$this->setVcodeCheck($mobile,$vcode);
				return $vcode;
			}
			return FALSE;
		}
	
		public function checkVcode($mobile){
			$key=VCODE_CHECK_PRE.$mobile;
			return $this->ttlKey($key);
		}
	
		private function setVcodeCheck($mobile,$vcode){
			$key=VCODE_CHECK_PRE.$mobile;
			$this->setKey($key,$vcode);
			$this->expireKey($key,SKIP_VCODE_CHECK?5:USER_MOBILE_DELAY);
			return TRUE;
		}
		
		public function getMobileVcode($mobile){
			return $this->getKey($mobile.VCODE_SUFFIX);
		}
		
		public function setMobileVcode($vcode,$mobile){
			$this->setKey($mobile.VCODE_SUFFIX,$vcode);
			$this->expireKey($mobile,600);		//设置10分钟的过期时间
			return TRUE;
		}
		
		public function vcode($len=USER_VCODE_LENGTH){
			$rst='';
			for($i=0;$i<$len;$i++)$rst.=rand(0, 9);
			return $rst;
		}
		
		public function getToken($len=10){
			return substr(md5(USER_PASS_SALT.time().uniqid()),32-$len);
		}
		
		private function md5Pass($pass,$salt){
			return md5($pass.$salt);
		}
		
		private function uuid(){
		    $str = md5(uniqid(mt_rand(), true));
		    $uuid  = substr($str,0,8) . '-';   
		    $uuid .= substr($str,8,4) . '-';   
		    $uuid .= substr($str,12,4) . '-';   
		    $uuid .= substr($str,16,4) . '-';   
		    $uuid .= substr($str,20,12);   
		    return $uuid;
		}
		
		//生成需要的spam,替代uuid和token进行认证，可以防止冒用
		private function spam($n=7){
			$hash='';
			for($i=0;$i<$n;$i++) $hash.=$i%2?chr(rand(97,122)):chr(rand(65,90));
			return $hash;
		}
		
		private function salt(){
			return $this->char(5);
		}
	}