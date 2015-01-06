<%@page import="cn.edu.ahpu.tpc.framework.core.spring.security.CookieAuthenticationFilter"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head></head>

<body>
	用户不存在
	
	<%
		final Cookie[] cookies = request.getCookies();
    	if (cookies != null) {
    		for (int i = 0; i < cookies.length; i++) {
    	 		final Cookie cookie = cookies[i];
    	 		if (cookie.getName().equals(CookieAuthenticationFilter.COOKIE_NAME_USER)) {
    	 			cookie.setMaxAge(0);
    	 			response.addCookie(cookie);
    	 		}
    	 	}
    	 }
	%>
</body>
</html>