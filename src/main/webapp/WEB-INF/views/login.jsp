<%@page import="cn.edu.ahpu.tpc.framework.web.util.admin.LoginParaUtil"%>
<%@page contentType="text/html;charset=UTF-8"%>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="./resources/js/ext/resources/css/ext-all.css" />
    <script type="text/javascript" src="./resources/js/ext/ext-base.js"></script>
    <script type="text/javascript" src="./resources/js/ext/ext-all.js"></script>
    <script type="text/javascript" src="./resources/js/ext/ext-lang-zh_CN.js"></script>

	<script type="text/javascript" src="./resources/js/ux/ST.ux.Cookie.js"></script>
	<script type="text/javascript" src="./resources/js/ux/ST.ux.ExtField.js"></script>
	<script type="text/javascript" src="./resources/js/admin/ST.Base.Register.js"></script>
	<script type="text/javascript" src="./resources/js/admin/ST.Base.Login.js"></script>
	<script type="text/javascript"> 
	     if(top!=self){
	          if(top.location != self.location)
	               top.location=self.location; 
	     }
	     register = <%= LoginParaUtil.getRegisterValue()%>;
	     autoLogin = <%= LoginParaUtil.getAutoLoginValue()%>;
	</script>
	<style type="text/css">
	    body {
			background:#3d71b8 url(./resources/images/core/login/desktop.jpg) no-repeat left top;
		    font: normal 12px tahoma, arial, verdana, sans-serif;
			margin: 0;
			padding: 0;
			border: 0 none;
			overflow: hidden;
			height: 100%;
		}
		
		#ToolBar {
			position:absolute;
			bottom:0px;
			width:100%;
			height:60px;
			text-align:center;
			overflow:hidden;
			Z-index:100000
		}
	</style>
  </head>
  <body>
	<div>
		<div id="login"></div>
	</div>
	<div id="ToolBar">
		推荐使用浏览器：<a target="_blank" href="https://www.google.com/intl/zh-CN/chrome/browser/">Chrome</a>、
		<a target="_blank" href="http://www.mozilla.org/en-US/firefox/new/">Firefox</a>
		、<a target="_blank" href="http://www.opera.com/zh-cn">Opera</a>
		或者<a target="_blank" href="http://windows.microsoft.com/zh-cn/internet-explorer/download-ie">IE9&10</a></br>
		<img alt="Chrome" src="/resources/images/core/login/chrome.png">
		<img alt="Firefox" src="/resources/images/core/login/firefox.png">
		<img alt="Opera" src="/resources/images/core/login/opera.png">
		<img alt="IE" src="/resources/images/core/login/IE.png">
	</div>
	<div style="display: none">
		AJAX-AccessDeniedException
	</div>
  </body>
</html>