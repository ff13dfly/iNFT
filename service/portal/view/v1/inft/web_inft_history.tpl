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

		<h3>iNFT Cache Management - History of iNFT
			<small>Search the history of iNFT on cache</small>
		</h3>
		<div class="row">
			<div class="col-lg-8">
				<div class="row">
					<div class="col-lg-4">
						<input class="form-control" value="" placeholder="Search iNFT history by name..." />
					</div>
					<div class="col-lg-3 text-right">
						<button class="btn btn-md btn-primary">Search</button>
					</div>
					<div class="col-lg-5"></div>
					<div class="col-lg-12" id="block_result">
						<table class="table table-hover">
							<thead>
								<tr>
									<th>Name</th>
									<th>Hash</th>
									<th>Template</th>
									<th>Stamp</th>
									<th>Network</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>ii_33</td>
									<td>0xadafd</td>
									<td>cid</td>
									<td>2024-07-08 20:23:12</td>
									<td>anchor</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="col-lg-4">
				<h4>Caching Robot Status</h4>
				<p>The status of the caching status is used to monitor the caching status.</p>
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Description</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Total blocks</td>
							<td>{%$F.sum%} </td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>

<script type="text/javascript">

</script>

{%include file="{%DEF_VERSION%}/common/web_footer.tpl" title=foo%}