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