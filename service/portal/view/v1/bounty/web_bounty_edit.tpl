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
						<div class="row">
							<div class="col-lg-3">
								<h5>Bounty Apply</h5>
							</div>
							<div class="col-lg-9 text-right">
							<h5 id="info">Linking...</h5>
							</div>
						</div>
						
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
										<button class="btn btn-sm btn-primary apply_accept"
											data="{%$k%}">Accept</button>
										<button class="btn btn-sm btn-danger apply_refuse" data="{%$k%}">Refuse</button>
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
	const node="{%ANCHOR_NETWORK_NODE%}";
	let wsAPI = null
	const Decoder = Easy.easyRun;
	const startAPI = {
		common: {
			"latest": AnchorJS.latest,
			"target": AnchorJS.target,
			"history": AnchorJS.history,
			"owner": AnchorJS.owner,
			"subcribe": AnchorJS.subcribe,
			"block": AnchorJS.block,
		}
	};
	const chain = {
		init: function(ck) {
			if (wsAPI !== null) return ck && ck(wsAPI);
			const {ApiPromise,WsProvider}=window.Polkadot;
			ApiPromise.create({ provider: new WsProvider(node) }).then((api) => {
			AnchorJS.set(api);
			return ck && ck(wsAPI);
		});
	},
	}
	chain.init(function(API) {
		$("#info").html(`Node linked: ${node}`);
	});
</script>

<script type="text/javascript">
	const bounty={%json_encode($F.data)%}
	const self={
		applyAccept:(bounty,apply,inft,bonus,ck)=>{
			const name=`judge_`;
			const raw={
				bounty:bounty,
				apply:apply,
				inft:inft,
				bonus:bonus,			//bonus index
				status:"judge",
			}
			const protocol={
				fmt: "json", 
            	type: "data",
                app:"inft",
                ref:bounty,
			}

			console.log(name,raw,protocol);

			return ck && ck();
		}
	}

	$(".apply_accept").off("click").on("click", function() {
		const index = parseInt($(this).attr("data"));
		const ps=bounty.apply;
		const current=ps[index];
		const bonus_index=2;
		//1.set anchor to storage the status
		
		self.applyAccept(bounty.alink,current.record,current.link,bonus_index,(res)=>{

			//2.update the status on portal
			console.log(res);

		});
	});

	$(".apply_refuse").off("click").on("click", function() {
		const index = parseInt($(this).attr("data"));
		console.log(index);

		//1.set anchor to storage the status

		//2.update the status on portal
	});
</script>

{%include file="{%DEF_VERSION%}/common/web_footer.tpl" title=foo%}