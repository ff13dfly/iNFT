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
				<a href="?mod=bounty&act=list">Bounty List</a>
			</li>
			<li class="active">Edit {%$F.data.alink%} </li>
		</ol>
		<div class="row">
			<div class="col-lg-9">
				<div class="panel panel-default">
					<div class="panel-heading">
						<div class="row">
							<div class="col-lg-3">
								<a class="pull-left" href="#" data-tool="panel-collapse" data-toggle="tooltip" title="">
									<h5>Bounty Apply</h5>
								</a>
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
									<th>Status</th>
								</tr>

								{%if count($F.data.apply) neq 0%} {%foreach from=$F.data.apply key=k item=v %}

								<tr>
									<td></td>
									<td>
										<a href="#" target="_blank">{%$v.link%}</a>
									</td>
									<td>
										<a href="#" target="_blank">{%$v.record%}</a>
									</td>
									<td>{%date("Ymd",$v.stamp)%}</td>
									<td>
										{%if $v.status eq BOUNTY_APPLY_SUBMITTED%}
										<button class="btn btn-sm btn-primary apply_accept"
											data="{%$k%}">Accept</button>
										<button class="btn btn-sm btn-danger apply_refuse" data="{%$k%}">Refuse</button>
										{%else%}
										{%if $v.status eq BOUNTY_APPLY_FAILED%}
										<span class="text-dark">{%$F.status[$v.status]%}</span>
										{%else%}
										<span class="text-danger">{%$F.status[$v.status]%}</span>
										{%/if%}
										{%/if%}
									</td>
								</tr>

								{%/foreach%} {%/if%}
							</table>
						</div>
					</div>
					<div class="panel-footer">
						<div class="row">
							<div class="col-lg-3">
								<input class="form-control" id="account_json" type="file" />
							</div>
							<div class="col-lg-4">
								<input class="form-control" id="account_password" type="password"
									placeholder="Password for approve account." />
							</div>
							<div class="col-lg-1 text-right">
								<button class="btn btn-md btn-primary" id="account_load">Load</button>
							</div>
							<div class="col-lg-4" id="account_info">

							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-lg-3">
				<div class="panel panel-default">
					<div class="panel-heading">
						<div class="row">
							<div class="col-lg-6">
								<a class="pull-left" href="#" data-tool="panel-collapse" data-toggle="tooltip" title="">
								<h5>Bounty Information</h5>
								</a>
							</div>
							<div class="col-lg-6 text-right">
								<h5 id="info_distribute"></h5>
							</div>
						</div>
					</div>
					<div class="panel-wrapper collapse in">
						<div class="panel-body">

						</div>
					</div>
					<div class="panel-footer">
						{%$F.data.alink%}
					</div>
				</div>
			</div>

			<div class="col-lg-9">
				<div class="panel panel-default">
					<div class="panel-heading">
						
						<div class="row">
							<div class="col-lg-3">
								<a class="pull-left" href="#" data-tool="panel-collapse" data-toggle="tooltip" title="">
									<h5>Bounty Distribition</h5>
								</a>
							</div>
							<div class="col-lg-9 text-right">
								<h5 id="info_distribute"></h5>
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
								{%if $v.status eq BOUNTY_APPLY_APPROVED%}
								<tr>
									<td></td>
									<td>{%$v.link%}</td>
									<td>{%$v.record%}</td>
									<td>{%date("Ymd",$v.stamp)%}</td>
									<td>
										<button class="btn btn-sm btn-primary apply_accept" data="{%$k%}">Payed</button>
									</td>
								</tr>
								{%/if%}
								{%/foreach%} {%/if%}
							</table>
						</div>
					</div>
					<div class="panel-footer">
						<div class="row">
							<div class="col-lg-3">
								<input class="form-control" id="account_json" type="file" />
							</div>
							<div class="col-lg-4">
								<input class="form-control" id="account_password" type="password"
									placeholder="Password for distribute account." />
							</div>
							<div class="col-lg-1 text-right">
								<button class="btn btn-md btn-primary" id="account_load">Load</button>
							</div>
							<div class="col-lg-4" id="account_info">

							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="col-lg-3">
				<div class="panel panel-default">
					<div class="panel-heading">
						<div class="row">
							<div class="col-lg-6">
								<a class="pull-left" href="#" data-tool="panel-collapse" data-toggle="tooltip" title="">
								<h5>Bounty Payment</h5>
								</a>
							</div>
							<div class="col-lg-6 text-right">
								<h5 id="info_distribute"></h5>
							</div>
						</div>
					</div>
					<div class="panel-wrapper collapse in">
						<div class="panel-body">

						</div>
					</div>
					<div class="panel-footer">
						{%$F.data.payment%}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
<script type="text/javascript">
	//anchor network functions
	const node="{%ANCHOR_NETWORK_NODE%}";
	let wsAPI = null;
	let pair = null;
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
	const Chain = {
		init: function(ck) {
			if (wsAPI !== null) return ck && ck(wsAPI);
			const {ApiPromise,WsProvider}=window.Polkadot;
			ApiPromise.create({ provider: new WsProvider(node) }).then((api) => {
				AnchorJS.set(api);
				return ck && ck(wsAPI);
			});
		},
		load: function(fa, password, ck) {
			console.log(fa, password);
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const sign = JSON.parse(e.target.result);
					console.log(sign);
				} catch (error) {
					return ck && ck({error:"Invalid account JSON file."});
				}
			};
			reader.readAsText(fa);
			return ck && ck();
		},
	};
</script>

<script type="text/javascript">
	//bounty information
	Chain.init(function(API) {
	$("#info").html(`Node linked: ${node}`);

	Decoder("{%$F.data.alink%}",startAPI,(data)=>{
	if (data.error.length !== 0) {

		return false;
	}
	console.log(data);
	});
	});
</script>

<script type="text/javascript">
	const bounty={%json_encode($F.data)%}
	const self = {
		toChain: (bounty, apply, inft, bonus, result, ck) => {
			const name = `judge_`;
			const raw = {
				bounty: bounty,
				apply: apply,
				inft: inft,
				bonus: bonus, //bonus index
				status: "judge",
				result: result, //apply result
			}
			const protocol = {
				fmt: "json",
				type: "data",
				app: "inft",
				ref: bounty,
			}
			const dt = {
				alink: "anchor://hello/123",
			}

			return ck && ck(dt);
		},
		fresh: () => {
			loacation.reload();
		},
	}

	$(".apply_accept").off("click").on("click", function() {
		const index = parseInt($(this).attr("data"));
		const ps = bounty.apply,
			bonus = bounty.detail;
		const current = ps[index];
		const bonus_index = 2;

		//1.set anchor to storage the status
		self.toChain(bounty.alink, current.record, current.link, bonus_index, true, (res) => {

			//2.update the status on portal
			console.log(res);
			const id = parseInt(bounty.id);
			const param={id:id,index:index,record:res.alink};
			const cfg = {mod:'bounty',act:'accept',param:param}
			FF.fn.ajax(cfg, false, function(dt) {
				if (dt.success) return self.fresh();
			});
		});
	});

	$(".apply_refuse").off("click").on("click", function() {
		const index = parseInt($(this).attr("data"));
		const ps = bounty.apply,
			bonus = bounty.detail;
		const current = ps[index];
		const bonus_index = 2;

		//1.set anchor to storage the status
		self.toChain(bounty.alink, current.record, current.link, bonus_index, false, (res) => {

			//2.update the status on portal
			console.log(res);
			const id = parseInt(bounty.id);
			const param={id:id,index:index,record:res.alink};
			const cfg = {mod:'bounty',act:'refuse',param:param}
			FF.fn.ajax(cfg, false, function(dt) {
				if (dt.success) return self.fresh();
			})
		});
	});

	let file = null;
	$("#account_json").off("change").on("change", function(ev) {
		//const val=$(this).val();
		file = ev.target.files[0];
		// const pass=$("#account_password").val();
		// if(!pass){

		// 	return $("#account_info").html("Input password.");
		// } 

	});

	$("#account_load").off("click").on("click", function() {
		const pass = $("#account_password").val();
		if (!pass) return $("#account_info").html("Invalid password.");
		Chain.load(file, pass, function() {

		});
	});
</script>

{%include file="{%DEF_VERSION%}/common/web_footer.tpl" title=foo%}