
<aside class="aside">
	<div class="aside-inner">
		<nav class="sidebar" data-sidebar-anyclick-close="">
			<ul class="nav">
				<li class=" ">
					<a href="{%BASE_DOMAIN%}" title=""><em class="icon-info"></em><span>{%SYSTEM_NAME%} [ {%DEF_VERSION%} ]</span></a>
				</li>
				<li>
					<a id="user-block-toggle" href="#user-block" data-toggle="collapse">
					<em class="icon-user"></em><span>管理员信息</span></a>
				</li>
				{%include file="{%DEF_VERSION%}/common/web_user.tpl" title=foo%}
                <li class=" ">
					<a href="#trend" title="Widgets" data-toggle="collapse">
						<!--<div class="pull-right label label-success">30</div>-->
						<em class="icon-graph"></em><span>运营状态</span>
					</a>
					<ul class="nav sidebar-subnav collapse" id="trend">
						<li class="{%if $F.request.mod eq 'trend' && $F.request.act eq 'today'%}active{%/if%}">
							<a href="?mod=system&act=overview" title="运营概要..."><span>运营状态</span></a>
                        </li>
                        <li class="{%if $F.request.mod eq 'hack' && $F.request.act eq 'list'%}active{%/if%}">
							<a href="?mod=hack&act=list" title="运营概要..."><span>黑客行为</span></a>
                        </li>
                        <li class="{%if $F.request.mod eq 'log' && $F.request.act eq 'list'%}active{%/if%}">
							<a href="?mod=log&act=list" title="运营概要..."><span>用户行为</span></a>
                        </li>
                     </ul>
				</li>
				<li class=" ">
					<a href="#user" title="" data-toggle="collapse">
						<em class="icon-people"></em><span>用户管理</span>
					</a>
					<ul class="nav sidebar-subnav collapse" id="user">
                        <li class="{%if $F.request.mod eq 'user' && $F.request.act eq 'list'%}active{%/if%}">
							<a href="?mod=user&act=list" title=""><span>用户列表</span></a>
                        </li>
                        {%if $F.request.mod eq 'user' && $F.request.act eq view%}
                        <li class="active">
                           <a href="?mod=user&act=view&id={%$F.user.uid%}" title=""><span>查看用户行为</span></a>
                        </li>
                        {%/if%}
                        {%if $F.request.mod eq 'user' && $F.request.act eq edit%}
                        <li class="active">
                           <a href="?mod=user&act=edit&id={%$F.user.uid%}" title=""><span>编辑用户信息</span></a>
                        </li>
                        {%/if%}
                        {%if $F.request.mod eq 'user' && $F.request.act eq 'status'%}
                        <li class="active">
                           <a href="?mod=user&act=status&uuid={%$F.user.uid%}" title=""><span>用户信息</span></a>
                        </li>
                        {%/if%}
                     </ul>
				</li>     

				<li class=" ">
					<a href="#admin" title="" data-toggle="collapse">
						<em class="icon-lock"></em><span>系统管理员</span>
					</a>
					<ul class="nav sidebar-subnav collapse" id="admin">
                        <li class="{%if $F.request.mod eq 'admin' && $F.request.act eq 'list'%}active{%/if%}">
							<a href="?mod=admin&act=list" title=""><span>管理员列表</span></a>
                        </li>
                        {%if $F.request.mod eq 'admin' && $F.request.act eq edit%}
                        <li class="active">
                           <a href="?mod=admin&act=edit&id={%$F.admin.id%}" title=""><span>编辑管理员信息</span></a>
                        </li>
                        {%/if%}
                     </ul>
				</li>
			</ul>
		</nav>
	</div>
</aside> 
