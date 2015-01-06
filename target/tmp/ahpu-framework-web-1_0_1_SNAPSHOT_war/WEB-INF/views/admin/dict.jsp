<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="/resources/js/ext/resources/css/ext-all.css" />
    <script type="text/javascript" src="/resources/js/ext/ext-base.js"></script>
    <script type="text/javascript" src="/resources/js/ext/ext-all.js"></script>
    <script type="text/javascript" src="/resources/js/ext/ext-lang-zh_CN.js"></script>
    
	<link rel="stylesheet" type="text/css" href="/resources/css/icons.css" />
	<link rel="stylesheet" type="text/css" href="/resources/css/index.css" />
	<script type="text/javascript" src="/resources/js/ux/ST.ux.util.js"></script>
	<script type="text/javascript" src="/resources/js/ux/Ext.ux.TreeCombo.js"></script>
	<script type="text/javascript" src="/resources/js/ux/ST.ux.ExtField.js"></script>
	<script type="text/javascript" src="/resources/js/ux/Ext.ux.PagePlugins.js"></script>
	<script type="text/javascript" src="/resources/js/ux/ST.ux.PlainGrid.js"></script>
	<script type="text/javascript" src="/resources/js/ux/ST.ux.PlainTree.js"></script>
	<script type="text/javascript" src="/resources/js/ux/ST.ux.ViewGrid.js"></script>
	
	<script type="text/javascript" src="/resources/js/admin/ST.Base.Dict.js"></script>
	<style type="text/css">
	#ext-gen40 {
			  white-space:nowrap;
		     }     
	</style>
	<script type="text/javascript">
		Ext.onReady(function(){
			Ext.override(Ext.Component, {
			    stateful: false
			});
		    new ST.base.dictView();
		});
	</script>
  </head>
  <body>
	<input type="hidden" id="CONTEXT_PATH" value="<%= request.getContextPath() %>" />
  </body>
</html>