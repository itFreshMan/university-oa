<%@page import="cn.edu.ahpu.tpc.framework.core.util.SecurityContextUtil"%>
<%@page import="cn.edu.ahpu.tpc.framework.core.support.ProfileApplicationContextInitializer"%>
<%@page contentType="text/html;charset=UTF-8"%>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="/resources/js/ext/resources/css/ext-all.css" />
    <script type="text/javascript" src="/resources/js/ext/ext-base.js"></script>
    <script type="text/javascript" src="/resources/js/ext/ext-all.js"></script>
    <script type="text/javascript" src="/resources/js/ext/ext-lang-zh_CN.js"></script>
    
    <link rel="stylesheet" type="text/css" href="/resources/css/ext/tab-scroller-menu.css" />
	<link rel="stylesheet" type="text/css" href="/resources/css/icons.css" />
	<link rel="stylesheet" type="text/css" href="/resources/css/oa_icons.css" />
	<link rel="stylesheet" type="text/css" href="/resources/css/index.css" />
	<script type="text/javascript" src="/resources/js/ux/Ext.ux.TabScrollerMenu.js"></script>
	<script type="text/javascript" src="/resources/js/ux/ST.ux.util.js"></script>
	<script type="text/javascript" src="/resources/js/ux/Ext.ux.AccordionPanel.js"></script>
	<script type="text/javascript" src="/resources/js/ux/Ext.ux.TreeCombo.js"></script>
	<script type="text/javascript" src="/resources/js/ux/ST.ux.ExtField.js"></script>
	<script type="text/javascript" src="/resources/js/ux/uxVtypes.js"></script>
	<script type="text/javascript" src="/resources/js/admin/ST.Base.Home.js"></script>
	<link href="/resources/css/jc_css.css" rel="stylesheet" type="text/css" />
	<!--[if IE 6]>
	<script src="/resources/js/EvPNG.js" type="text/javascript"></script>
	<script type="text/javascript">
	   EvPNG.fix('.top_logo, img,.top_ricon_a,.top_ricon_b,.top_ricon_c');
	</script>
	<![endif]-->
  </head>
  <body>
   <script type="text/javascript"> 
    function getCurrentTime(){
    	return new Date().toLocaleString();
    }; 
    setInterval("curTime.innerHTML=getCurrentTime();",1000);
    </script>
  	<input type="hidden" id="casPorfile" value="<%=ProfileApplicationContextInitializer.casProfile %>" />
  	<input type="hidden" id="CONTEXT_PATH" value="<%= request.getContextPath() %>" />
 <div style="display: none;">
	   <div id="app-header" >
	        <div class="top_b">
		   	    <div class="fn-left top_logo"></div>
			    <div class="top_r">
			     	   <p><span>您好,<b><%= SecurityContextUtil.getCurrentUser().getUserName() %></span> 今天是:<span id="curTime"><script>curTime.innerHTML=getCurrentTime();</script></span></b></p>
			       	   <div class="top_ricon">
				            <ul>
				                <li class="top_ricon_a"><a href="#" onClick=Home.OpenOnLineWin();>在线用户</a></li>
				                <li class="top_ricon_b"><a href="#" onClick=ST.base.PersonConfig.showWin("personConfig");>个人设置</a></li>
				                <li class="top_ricon_c"><a href="#" onClick=Home.Logout();>退出系统</a></li>
				            </ul>
				        </div>
				    </div>
			 </div>
	        <!-- top end -->
      
	    </div> 
	    <div id="home-panel">
	        <p>主页内容</p>
	    </div>
    </div>
    <script type="text/javascript" src="/resources/js/ux/Ext.ux.TabCloseMenu.js"></script>
	<script type="text/javascript" src="/resources/js/admin/ST.Base.PersonConfig.js"></script>
  </body>
</html>