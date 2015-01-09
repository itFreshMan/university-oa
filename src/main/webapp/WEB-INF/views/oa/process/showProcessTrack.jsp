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
	  			<th>
	  				<td>开始&nbsp;&nbsp;&nbsp;&nbsp;&rArr;&nbsp;&nbsp;&nbsp;&nbsp;</td>
					<c:forEach var="data" items="${optionList}" varStatus="status"> 
							<td>${data.actName}&nbsp;&nbsp;&nbsp;&nbsp;&rArr;&nbsp;&nbsp;&nbsp;&nbsp;</td>
					</c:forEach> 
					<c:forEach var="data" items="${runningAct}" varStatus="status"> 
							<td><font color="red">${data.actName}</font></td>
					</c:forEach>  		
					<c:if test="${fn:length(runningAct) == 0 }">
					  	 	<td>结束</td>
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