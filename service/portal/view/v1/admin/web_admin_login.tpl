{%include file="{%DEF_VERSION%}/common/web_header.tpl" title=foo%}
<style type="text/css">
	#logo{background: #EFEFF8;height: 400px;border-right: 1px solid #EDEDED;border-radius: 30px;border-top-right-radius: 0px;border-bottom-right-radius: 0px;}
	#logo img{width:100%;}
	#login_form{padding-top:80px;background: #EFEFF8;height: 400px;padding-right: 50px;;padding-left: 50px;border-radius: 30px;border-top-left-radius: 0px;border-bottom-left-radius: 0px;}
</style>
<div class="container" style="padding-top: 100px;">
	<div class="row">
		<div class="col-lg-3 col-md-3">
		</div>
		<div class="col-lg-3 col-md-3" id="logo">
			<img src="static/vbw.png"/>
		</div>
		<div class="col-lg-3  col-md-3 text-left" id="login_form">
			<h4 style="margin-bottom: 30px;">Manager System</h4>
			<div id="info" style="color: #FF6600;"></div>
			<div class="form-group">
				<input class="form-control" type="text" id="login_name" name="login_name" placeholder="管理员账户">
			</div>
			<div class="form-group">
				<input class="form-control" type="password" id="login_pass" name="login_pass" placeholder="管理员密码">
			</div>
			<div class="form-group text-right">
				<button class="btn btn-lg btn-primary" id="btn_login" type="submit">登陆虚块世界管理系统</button>
			</div>
		</div>
	</div>
</div>
<script src="{%$F.cdn%}/js/md5.js"></script>
<script type="text/javascript">
	var dsalt="{%$F.dsalt%}";
	var salt="";
	
	$("#login_name").on('blur',function(){
		//console.log('这里进行静态salt的获取');
		var name=$("#login_name").val();
		if(!name) return false
		var cfg={mod:'admin',act:'salt',param:{name:name,d:'ajax'}}
		FF.fn.ajax(cfg,false,function(res){
			console.log(res)
			if(res.success) salt=res.salt;
		});
	});
	
	$("#btn_login").on('click',function(){
		var name=$("#login_name").val(),pass=$("#login_pass").val();
		if(!name || !pass || !salt) return	false;
		var cfg={mod:'admin',act:'login',param:{pass:hex_md5(hex_md5(pass+salt)+dsalt),d:'ajax'}}
		FF.fn.ajax(cfg,false,function(res){
			console.log(res)
			if(!res.success){
				$("#info").html('用户名或密码错误')
				$("#login_pass").val('')
			}
			if(res.success) location.reload()
		})
	})
</script>