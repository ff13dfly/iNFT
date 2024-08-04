{%include file="{%DEF_VERSION%}/common/web_header.tpl" title=foo%}
{%include file="{%DEF_VERSION%}/common/web_aside.tpl" title=foo%}
<section>
	<div class="content-wrapper">
		<ul class="nav navbar-nav controller">
			<li>
				<a class="hidden-xs" href="#" data-trigger-resize="" data-toggle-state="aside-collapsed"><em
						class="fa fa-navicon"></em></a>
				<a class="visible-xs sidebar-toggle" href="#" data-toggle-state="aside-toggled"
					data-no-persist="true"><em class="fa fa-navicon"></em></a>
			</li>
		</ul>

		<h3>Bounty List
			<small>Bounty of template mining.</small>
		</h3>
		<div class="row">
			<div class="col-lg-9">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5>Bounty List</h5>
					</div>
					<div class="panel-wrapper collapse in">
						<div class="panel-body">
						<table class="table table-hover">
						<tr>
							<th></th>
							<th>Alink</th>
							<th>头像</th>
							<th><a href="?mod=user&act=list&od=name{%if $F.dec%}&dc=0{%/if%}">用户名</a></th>
							<th><a href="?mod=user&act=list&od=phone{%if $F.dec%}&dc=0{%/if%}">手机</a></th>
							<th>UUID</th>
							<th>性别</th>
							<th><a href="?mod=user&act=list&od=from{%if $F.dec%}&dc=0{%/if%}">来源</a></th>
							<th><a href="?mod=user&act=list&od=login{%if $F.dec%}&dc=0{%/if%}">最后登录</a></th>
							<th>操作</th>
						</tr>

						{%if count($F.list) neq 0%} {%foreach from=$F.list key=k item=v %}
						<tr class="text-left">
							<td><input type="checkbox" class="check_list" value="{%$v.id%}" /></td>
							<td class="id">{%$v.id%}</td>
							<td class="id"><a href="?mod=bounty&act=edit&id={%$v.id%}">{%$v.alink%}</a></td>
							<td class="nobreak">
								
								<button class="btn btn-sm btn-default user_cache" data="{%$v.uid%}">缓存</button>
								{%if $v.status eq 0%}
								<button class="btn btn-sm btn-default status_show" data="{%$v.uid%}">开放</button> {%else%}
								<button class="btn btn-sm btn-danger status_close" data="{%$v.uid%}">禁用</button> {%/if%}
								<a href="?mod=user&act=edit&id={%$v.uid%}"><button class="btn btn-sm btn-primary">用户管理</button></a>
								<div class="btn-group">
									<button data-toggle="dropdown" class="btn btn-sm dropdown-toggle">其他操作 <span class="caret"></span></button>
									<ul class="dropdown-menu">
										<li>
											<a href="?mod=user&act=edit&id={%$v.uid%}"><em class="icon-note"></em><span> 编辑用户信息</span></a>
										</li>
									</ul>
								</div>
							</td>
						</tr>
						{%/foreach%} {%/if%}
						<tr class="row_selected">
							<td colspan="12">
								<div class="z">
									<button class="btn btn-sm btn-default" id="select_all">全选</button>
									<button class="btn btn-sm btn-default" id="close_all">关闭</button>
									<button class="btn btn-sm btn-default" id="show_all">开放</button>
								</div>
								<div class="y">
									<button class="btn btn-sm btn-primary" id="cache_all">更新缓存</button>
								</div>
							</td>
						</tr>
					</table>
						</div>
					</div>
					<div class="panel-footer">

					</div>
				</div>
			</div>
			<div class="col-lg-3">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5>Add New Bounty</h5>
					</div>
					<div class="panel-wrapper collapse in">
						<div class="panel-body">
							<div class="row">
								<div class="col-lg-12">
									<input class="form-control" value="" placeholder="Title of bounty" />
								</div>
								<div class="col-lg-12" style="margin-top: 10px;">
									<textarea class="form-control" cols="4" placeholder="CID of IPFS template..."></textarea>
								</div>
								<div class="col-lg-12 text-right" style="margin-top: 10px;">
									<button class="btn btn-md btn-primary"> + Bounty </button>
								</div>
							</div>
						</div>
					</div>
					<div class="panel-footer">

					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<script type="text/javascript">

</script>

{%include file="{%DEF_VERSION%}/common/web_footer.tpl" title=foo%}