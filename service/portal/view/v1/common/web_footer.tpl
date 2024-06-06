	<!--这里加载分析代码(cnzz等)-->
	<footer>
		<span><a href="#">傅忠强</a> <a href="#">173-6176-3006</a> &copy;VirtualBlockWorld.com</span>
		<p>
			页面执行时间:{%$F.debug.cost%},数据库查询:{%$F.debug.query%},Redis查询:{%$F.debug.redis%}
		</p>
	</footer>
</div>
<link rel="stylesheet" type="text/css" href="{%$F.cdn%}/css/angle/fix.css"/>

 {%if $F.request.mod eq 'chord' && $F.request.act eq 'edit'%}
 <style type="text/css">
 	.modal-backdrop{filter: alpha(opacity=0)!important;opacity: 0!important;}
 </style>
 <div class="modal fade" id="chordModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  aria-hidden="true" modal-backdrop="static" style="margin-top:150px;margin-left:-630px;">
	<div class="modal-dialog" >
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
				<h4 class="modal-title">编辑弦粒子数据条目</h4>
			</div>
			<div class="modal-body" id="modalBody"></div>
			<div class="modal-footer" id="modalFooter">
               	<button class="btn btn-primary" 	type="button" id="modal_chord_save"><em class="icon-refresh"> 保存</em></button>
			</div>
		</div>
	</div>
</div>
 <div class="modal slide" id="listModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  aria-hidden="true" modal-backdrop="static" style="margin-top:150px;margin-left:-630px;">
	<div class="modal-dialog" >
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
				<h4 class="modal-title">列表选择页面</h4>
			</div>
			<div class="modal-body"></div>
			<div class="modal-footer"></div>
		</div>
	</div>
</div>
{%/if%}

 {%if $F.request.mod eq 'world' && $F.request.act eq 'range'%}
 <style type="text/css">
 	.modal-backdrop{filter: alpha(opacity=0)!important;opacity: 0!important;}
 </style>
 <div class="modal slide" id="hotModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  aria-hidden="true" modal-backdrop="static" style="margin-top:50px;margin-left: 600px;">
	<div class="modal-dialog" >
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
				<h4 class="modal-title">推荐地块</h4>
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-md-6">
						<div class="row">
							<div class="col-md-12">
								<div class="form-group">
									<label class="control-label">推荐标题(<13字) *</label>
									<input class="form-control" type="text" id="hot_title" placeholder="请输入推荐标题..." value="" required>
								</div>
							</div>
							<div class="col-md-12">
								<div class="form-group">
									<label class="control-label">说明内容(<120字)  *</label>
									<textarea  class="form-control" id="hot_content" rows="5" cols="" placeholder="请输入推荐说明..."></textarea>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-6">
						<iframe src="http://10.0.1.66/world/web/" width="100%" height="500"></iframe>
					</div>
				</div>
				
			</div>
			<div class="modal-footer">
				<input type="hidden" id="hot_x"  value="0">
				<input type="hidden" id="hot_y"  value="0">
				<input type="hidden" id="hot_world"  value="0">
				<button class="btn btn-primary" 	type="button" id="modal_hot_save"><em class="icon-refresh"> 保存</em></button>
			</div>
		</div>
	</div>
</div>
{%/if%}
{%if $F.request.mod eq 'block' && $F.request.act eq 'chord'%}
 <style type="text/css">
 	.modal-backdrop{filter: alpha(opacity=0)!important;opacity: 0!important;}
 </style>
<div class="modal fade" id="chordModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"  aria-hidden="true" modal-backdrop="static" style="margin-top:100px;margin-left:650px;">
	<div class="modal-dialog" >
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
				<h4 class="modal-title"></h4>
			</div>
			<div class="modal-body"></div>
			<div class="modal-footer">
               	<button class="btn btn-primary" 	type="button" id="stair_config"><em class="icon-refresh">保存配置</em></button>
               	<button class="btn btn-primary" 	type="button" id="stair_auto"><em class="icon-plus">新添楼梯</em></button>
			</div>
		</div>
	</div>
</div>
{%/if%} 
{%if $F.request.mod eq 'block' && $F.request.act eq 'edit'%}
<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="margin-top: 200px;">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
				<h4 class="modal-title" id="modalTitle">Modal title</h4>
			</div>
			<div class="modal-body" id="modalBody"></div>
			<div class="modal-footer" id="modalFooter">
				<button class="btn btn-default" 	type="button" data-dismiss="modal" id="modalClose">Close</button>
               	<button class="btn btn-primary" 	type="button" id="modalSave">Save changes</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="margin-top: 200px;">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
				<h4 class="modal-title" id="modalTitle">添加新的信息</h4>
			</div>
			<div class="modal-body" id="modalBody"></div>
			<div class="modal-footer" id="modalFooter">
				<button class="btn btn-default" 	type="button" data-dismiss="modal" id="modalClose">Close</button>
               	<button class="btn btn-primary" 	type="button" id="modalInfoSave">New Info</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="giftModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="margin-top: 200px;">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
				<h4 class="modal-title" id="modalTitle">添加新的礼物</h4>
			</div>
			<div class="modal-body" id="modalBody"></div>
			<div class="modal-footer" id="modalFooter">
				<button class="btn btn-default" 	type="button" data-dismiss="modal" id="modalClose">Close</button>
               	<button class="btn btn-primary" 	type="button" id="modalGiftSave">New Gift</button>
			</div>
		</div>
	</div>
</div>

<div class="modal fade" id="selectComModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="margin-top: 200px;">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button class="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
               </button>
				<h4 class="modal-title" id="modalTitle">选择需要动作的组件</h4>
			</div>
			<div class="modal-body" id="modalBody">
				<div class="row">
					<div class="col-lg-3 col-md-3">
						<label class="control-label">组件类型 *</label>
						<select class="form-control" id="mod_change">
							<option value="light" >Light</option>
							<option value="stop" >stop</option>
							<option value="adjunct" >adjunct</option>
						</select>
					</div>
					<div class="col-lg-3 col-md-3" id="adj_change">
						
					</div>
					<div class="col-lg-6 col-md-6" id="mod_list">
						
					</div>
				</div>
			</div>
			<div class="modal-footer" id="modalFooter">
				<button class="btn btn-default" 	type="button" data-dismiss="modal" id="modalComSelectClose">Close</button>
               	<button class="btn btn-primary" 	type="button" id="modalComSelect">Select Component</button>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript">
	$("#mod_change").on('change',function(){
		var mod=$(this).val();
		if(mod=='adjunct'){
			//处理adjunct的多选择
			var dom='<label class="control-label">附属物类型 *</label><select class="form-control" >'
			for(var k in data.adjunct){
				dom+='<option value="'+k+'" >'+k+'</option>'
			}
			dom+='</select>'
			$("#adj_change").html(dom).find('select').off('change').on('change',function(){
				var adj=$(this).val();
				if(data.adjunct[adj].length<1) return false;
				
				var dom='<label class="control-label">附属物列表 *</label><select class="form-control" >'
				for(var kk in data.adjunct[adj]){
					dom+='<option value="'+kk+'" >ID-'+kk+'</option>'
				}
				dom+='</select>';
				
				localStorage['selected']=JSON.stringify(['adjunct',adj,0]);
				
				$("#mod_list").html(dom).find('select').off('change').on('change',function(){

					var mid=$(this).val();
					var jmod=$('#adj_change select').val();
					localStorage['selected']=JSON.stringify(['adjunct',jmod,parseInt(mid)]);
				})
			});
			
		}else{
			//处理其他组件
			$("#adj_change").html('');
			if(data[mod].length<1) return false;
			var dom='<label class="control-label">'+mod+'列表 *</label><select class="form-control" >'
			for(var k in data[mod]){
				dom+='<option value="'+k+'" >ID-'+k+'</option>'
			}
			dom+='</select>'
			
			localStorage['selected']=JSON.stringify([mod,0]);
			$("#mod_list").html(dom).find('select').off('change').on('change',function(){
				var mid=$(this).val();
				//console.log(mid);
				localStorage['selected']=JSON.stringify([mod,parseInt(mid)]);
			})
		}
	})
</script>
{%/if%}

</body>
</html>