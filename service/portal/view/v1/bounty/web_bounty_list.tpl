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
			<small>Bounty management, accept or refuse apply of bounty.</small>
		</h3>
		<div class="row">
			<div class="col-lg-12" style="margin-bottom: 15px;">
				<div class="row" id="con_load">
					<div class="col-lg-2">
						<input class="form-control" id="account_json" type="file" />
					</div>
					<div class="col-lg-3">
						<input class="form-control" id="account_password" type="password"
							placeholder="Password of {%BOUNTY_ENTRY%}" />
					</div>
					<div class="col-lg-1 text-right">
						<button class="btn btn-md btn-primary" id="account_load">Load</button>
					</div>
					<div class="col-lg-6 message" id="account_info"></div>
				</div>
				<div class="row" id="con_drop" style="display: none;">
					<div class="col-lg-5">
						Account <strong><span class="text-danger">{%BOUNTY_ENTRY%}</span></strong> is active now.
					</div>
					<div class="col-lg-2 text-right">
						<button class="btn btn-md btn-primary" id="account_drop">Drop Account</button>
					</div>
					<div class="col-lg-5 message"></div>
				</div>
			</div>
			<div class="col-lg-12">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h5>Bounty List</h5>
					</div>
					<div class="panel-wrapper collapse in">
						<div class="panel-body">
							<table class="table table-hover">
								<tr>
									<th></th>
									<th>ID</th>
									<th>Alink</th>
									<th>Description</th>
									<th>Coin</th>
									<th>Apply</th>
									<th>Start(block)</th>
									<th>End(block)</th>
									<th>Status</th>
									<th>Applied</th>
								</tr>

								{%if count($F.list) neq 0%} {%foreach from=$F.list key=k item=v %}
								<tr class="text-left">
									<td><input type="checkbox" class="check_list" value="{%$v.id%}" /></td>
									<td class="id">{%$v.id%}</td>
									<td><a href="?mod=bounty&act=edit&id={%$v.id%}">{%$v.alink%}</a></td>
									<td></td>
									<td>{%$v.coin%}</td>
									<td>{%count($v.apply)%}</td>
									<td>{%$v.start%}</td>
									<td>{%$v.end%}</td>
									<td>{%$v.status%}</td>
									<td>
										{%if $v.applied eq 1%}
										<button class="btn btn-sm btn-warning bounty_offline" disabled
											data="{%$v.id%}">OFF</button>
										{%else%}
										<button class="btn btn-sm btn-primary bounty_applied" disabled
											data="{%$v.id%}">ON</button>
										{%/if%}
									</td>
								</tr>
								{%/foreach%} {%/if%}
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<script type="text/javascript">
	//anchor network functions
	const node="{%ANCHOR_NETWORK_NODE%}";
	//console.log(node);
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
				wsAPI=api;
				AnchorJS.set(api);
				return ck && ck(wsAPI);
			});
		},
		decode: function(json, password, ck) {
			try {
				const {Keyring}=window.Polkadot;
				const keyring = new Keyring({ type: "sr25519" });
				const signer = keyring.createFromJson(json);
				signer.decodePkcs8(password);
				return ck && ck(signer);
			} catch (error) {
				//console.log(error);
				return ck && ck({error:"Invalid password."});
			}
		},
		load: function(fa, password, ck) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const sign = JSON.parse(e.target.result);
					Chain.decode(sign, password, ck);
				} catch (error) {
					console.log(error);
					return ck && ck({error:"Invalid account JSON file."});
				}
			};
			reader.readAsText(fa);
		},
	};
</script>

<script type="text/javascript">
	const self={
		updateBountyEntry:(list,ck)=>{
			if(pair===null){
				self.info("No keyring to confirm.");
				return ck && ck(false);
			} 

			const entry="{%ANCHOR_ENTRY%}";
			Chain.init(()=>{
				const raw={
					data:list
				};
				const protocol={
					type:"data",
					fmt:"json",
					app:"inft",
				}
				//console.log(raw,pair);
				AnchorJS.write(pair, entry, raw, protocol, (res) => {
					console.log(res);
					self.info(JSON.stringify(res));
					if (res.step === "Finalized") {
						AnchorJS.search(entry, (adata) => {
							return ck && ck(`anchor://${entry}/${adata.block}`);
						});
					}
				});
			});
		},
		info:(txt)=>{
			//console.log(txt);
			$(".message").html(txt);
		},
	}
</script>


<script type="text/javascript">
	//get encry json file
	let file = null;
	$("#account_json").off("change").on("change", function(ev) {
		file = ev.target.files[0];
	});
	
	//load bounty entry account
	const account="{%BOUNTY_ENTRY%}";
	$("#account_load").off("click").on("click", function() {
		$("#account_info").html("");
		const me = $(this);
		me.prop("disabled", true);
		const pass = $("#account_password").val();
		$("#account_password").val(""); //clean the password

		if (file === null) {
			me.prop("disabled", false);
			return $("#account_info").html("Select account JSON file first.");
		}
		if (!pass) {
			me.prop("disabled", false);
			return $("#account_info").html("Invalid password.");
		}

		$("#account_info").html("Checking...");

		Chain.load(file, pass, (signer) => {
			me.prop("disabled", false);
			if (signer.error) return $("#account_info").html(signer.error);
			if (signer.address !== account) return $("#account_info").html("Unexcept manager of bounty entry.");

			pair = signer;

			$("#con_load").hide();
			$("#con_drop").show();

			$(".bounty_offline").prop("disabled", false);
			$(".bounty_applied").prop("disabled", false);

			file = null; //clean the json cache
			$("#account_json").val("");
		});
	});

	$("#account_drop").off("click").on("click", function() {
		pair = null;
		$(".bounty_offline").prop("disabled", true);
		$(".bounty_applied").prop("disabled", true);
	});
</script>

<script type="text/javascript">
	
	$(".bounty_applied").off("click").on("click", function() {
		$(this).prop("disabled", true);
		const id = parseInt($(this).attr("data"));
		const param={id:id};
		const cfg = {mod:'bounty',act:'applied',param:param}
		FF.fn.ajax(cfg, false, function(dt) {
			if(dt.success && dt.list){
				self.updateBountyEntry(dt.list,(alink)=>{
					self.info(alink+", reload in 3s.");
					setTimeout(() => {
						location.reload();
					}, 3000);
				});
			}
		})
	});

	$(".bounty_offline").off("click").on("click", function() {
		$(this).prop("disabled", true);
		const id = parseInt($(this).attr("data"));
		const param={id:id};
		const cfg = {mod:'bounty',act:'offline',param:param}
		FF.fn.ajax(cfg, false, function(dt) {
			if(dt.success && dt.list){
				self.updateBountyEntry(dt.list,(alink)=>{
					self.info(alink+", reload in 3s.");
					setTimeout(() => {
						location.reload();
					}, 3000);
				});
			}
		})
	});
</script>

{%include file="{%DEF_VERSION%}/common/web_footer.tpl" title=foo%}