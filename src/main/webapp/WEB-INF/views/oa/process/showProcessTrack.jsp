<%@page contentType="text/html;charset=UTF-8"%>
<%@ include file="/WEB-INF/views/taglib.jsp"%>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->
<!--[if !IE]><!--> <html lang="en"> <!--<![endif]-->
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
    <link rel="stylesheet" type="text/css" href="/resources/bootstrap/bootstrap.min.css" />
  </head>
  <body>

	<div class="panel panel-danger">
	  <div class="panel-heading">流程运行轨迹</div>
		    <table>
	  			<tr>
	  				<td><b>开始</b>&nbsp;&nbsp;&nbsp;&nbsp;&rArr;&nbsp;&nbsp;&nbsp;&nbsp;</td>
					<%-- <c:forEach var="data" items="${optionList}" varStatus="status"> 
							<td>${data.actName}&nbsp;&nbsp;&nbsp;&nbsp;&rArr;&nbsp;&nbsp;&nbsp;&nbsp;</td>
					</c:forEach>  --%>
					<c:forEach var="data" items="${runningAct}" varStatus="status"> 
						<c:choose>
							<c:when test="${data.curActFlag}">
								<td><font color='red'><b>${data.actName}</b></font></td>
							</c:when>
							<c:otherwise>  
								<td><font color='green'><b>${data.actName}</b></font>&nbsp;&nbsp;&nbsp;&nbsp;&rArr;&nbsp;&nbsp;&nbsp;&nbsp;</td>
   							</c:otherwise>  
						</c:choose>
					</c:forEach>  		
					<c:if test="${historyFlag == 1 }">
					  	 	<td><b>结束</b></td>
					</c:if>		 				
	  			</tr>
	  		</table>
	</div>
	  
	<div class="panel panel-danger">
	  <div class="panel-heading">流程图</div>
	  <div class="panel-body">
	    <img src = "${showProcessUrl}" alt="流程运行轨迹"></img>
	  </div>
	</div>  
 
  </body>
</html>