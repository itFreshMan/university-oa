<%@page contentType="text/html;charset=UTF-8"%>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html';charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="/resources/js/ext/resources/css/ext-all.css" />
    <script type="text/javascript" src="/resources/js/ext/ext-base.js"></script>
    <script type="text/javascript" src="/resources/js/ext/ext-all.js"></script>
    <script type="text/javascript" src="/resources/js/ext/ext-lang-zh_CN.js"></script>
    
	<link rel="stylesheet" type="text/css" href="/resources/css/icons.css" />
	<link rel="stylesheet" type="text/css" href="/resources/css/index.css" />
	<link rel="stylesheet" type="text/css" href="/resources/css/oa_icons.css" />
	<script type="text/javascript" src="/resources/js/ux/ST.ux.util.js"></script>
	<script type="text/javascript" src="/resources/js/ux/ST.ux.ExtField.js"></script>	
	<script type="text/javascript" src="/resources/js/ux/Ext.ux.PagePlugins.js"></script>
	<script type="text/javascript" src="/resources/js/ux/uxForm.js"></script>
	<script type="text/javascript" src="/resources/js/ux/uxGrid.js"></script>
	<script type="text/javascript" src="/resources/js/oa/staticData.js"></script>
	<script type="text/javascript" src="/resources/js/oa/sto/viewCheckorderInfoDetails.js"></script>
	<script type="text/javascript">
		var busiId = '${busiMap.busiId}';
		var orderNum = '${busiMap.orderNum}';
		var title = '${busiMap.titleContent}';
		var receiverName ='${busiMap.receiverName}';
		var content = '${busiMap.content}';
		var status = '${busiMap.status}';
		var telNo = '${busiMap.telNo}';
		var address = '${busiMap.address}';
		var postcode = '${busiMap.postcode}';
		var createTime = '${busiMap.createTime}';
		var createUser = '${busiMap.createUser}';
		var checkTime = '${busiMap.checkTime}';
		var checkUser = '${busiMap.checkUser}';
		
	
		var optionJson = '${detailsJson}';
	</script>
  </head>
  <body>
  </body>
</html>