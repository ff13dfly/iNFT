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

		<h3>Bounty Details
			<small>Bounty details and operation.</small>
		</h3>

		<ol class="breadcrumb">
		<li>
			<a href="?mod=bounty&act=list">奖励列表</a>
		</li>
		<li class="active">编辑 {%$F.data.alink%} </li>
	</ol>
		<div class="row">
			<div class="col-lg-12">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5>Bounty Apply</h5>
					</div>
					<div class="panel-wrapper collapse in">
						<div class="panel-body">
						<table class="table table-hover">
						<tr>
							<th></th>
							<th>iNFT</th>
							<th>Record</th>
							<th>Stamp</th>
							<th>Operation</th>
						</tr>
						
						{%if count($F.data.apply) neq 0%} {%foreach from=$F.data.apply key=k item=v %}
							<tr>
								<td></td>
								<td>{%$v.link%}</td>
								<td>{%$v.record%}</td>
								<td>{%date("Ymd",$v.stamp)%}</td>
								<td>
									<button class="btn btn-sm btn-primary" data="{%$v.uid%}">Accept</button>
									<button class="btn btn-sm btn-danger" data="{%$v.uid%}">Refuse</button>
								</td>
							</tr>
						{%/foreach%} {%/if%}
						</table>
						</div>
					</div>
					<div class="panel-footer">

					</div>
				</div>
			</div>
			<div class="col-lg-6">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5>Bounty Distribition</h5>
					</div>
					<div class="panel-wrapper collapse in">
						<div class="panel-body">
						
						</div>
					</div>
					<div class="panel-footer">

					</div>
				</div>
			</div>
			<div class="col-lg-6">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5>Bounty Information ( {%$F.data.alink%} )</h5>
					</div>
					<div class="panel-wrapper collapse in">
						<div class="panel-body">
							
						</div>
					</div>
					<div class="panel-footer">

					</div>
				</div>
			</div>
			<div class="col-lg-6">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5>Bounty Payment ( {%$F.data.payment%} )</h5>
					</div>
					<div class="panel-wrapper collapse in">
						<div class="panel-body">
							
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
	console.log(AnchorJS)
</script>

{%include file="{%DEF_VERSION%}/common/web_footer.tpl" title=foo%}