<%@ page language="java" import="java.util.*" pageEncoding="GB18030"%>
<% response.setHeader("P3P","CP='IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT'"); %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<script type="text/javascript" src="/resources/js/ext/ext-base.js"></script>
    	<script type="text/javascript" src="/resources/js/ext/ext-all.js"></script>
		<script type="text/javascript" src="/resources/js/ux/ST.ux.Cookie.js"></script>
	</head>
	
	<body>
		
		<%
		if(!"add".equals(request.getParameter("flag"))) {
		    Cookie cookie = new Cookie("USISSOCookieNameUser", request.getParameter("USISSOCookieNameUser"));
		    cookie.setPath("/");
		    cookie.setMaxAge(0);
		    response.addCookie(cookie);
		}
		%>
		<script language="javascript" type="text/javascript">
			var flag = "<%= request.getParameter("flag") %>";
			var cookieName = "<%= request.getParameter("USISSOCookieNameUser") %>";
			
			if(flag=="add"){
				Ext.ux.Cookie('USISSOCookieNameUser', cookieName, {expires: 30, path:"/"});
			}
		</script>
	</body>
</html>