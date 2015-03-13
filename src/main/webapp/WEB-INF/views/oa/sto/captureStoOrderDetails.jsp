<%@page contentType="text/html;charset=UTF-8"%>
<%@ include file="/WEB-INF/views/taglib.jsp"%>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->
<!--[if !IE]><!--> <html lang="en"> <!--<![endif]-->
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>    
    <link rel="stylesheet" type="text/css" href="/resources/bootstrap/bootstrap.min.css" />  
     <link rel="stylesheet" type="text/css" href="/resources/sto/css/sto_icons.css" />  
	<style type="text/css">
	th {
		padding: 6px 12px;
		background-color: #eeeeee;
		text-align:center;
	}
	td {
		padding: 5px 15px;
	}
	.container2 {
		padding-right: 15px;
		padding-left: 15px;
	}
	</style>
  </head>
  <body>
  	 <div class="container2" >
	
     
       <table class="table-striped" style="width:100%;">
       	<tr align="center">
       		<td colspan="3">
       			<a href="http://www.sto.cn/" target="_blank" style="display:inline;"><img alt="申通快递" src="/resources/sto/images/shentong.png"/> <b><font color="#27408B" >申通快递</font></b></a>
       			<span class="ico-tel" ><b>电话:95543</b></span>	
				<span class="ico-clock" ><b>已耗时${usedTimeStr}</b></span>	
       			<span class="ico-tel" ><b>订单号:<font color="#1C86EE" >${orderNum }</font></b></span>	
     		</td>
       	</tr>
       	<tr>
			<th width="25%">时间</th>
			<th ></th>
			<th width="70%">地点和跟踪进度</th>
		</tr>	
       <c:choose >
       		<c:when test="${!successFlag}">
				<tr>
					<td colspan="3" align="center">${busiInfo.message}</td>
				</tr>
			</c:when>
			
			<c:otherwise>
				<c:forEach var="item" items="${busiInfo.data}" varStatus="status"> 
				<tr>
					<td><fmt:formatDate value="${item.time }" type="both"/></td>
					<td class= 'status ${status.count == 1 ? "status-first": (status.count == dealRecordSize && busiInfo.ischeck == 1) ?"status-check":""}'>&nbsp;</td>
					<td>${item.context}</td>
				</tr>
			</c:forEach>
			</c:otherwise>
		</c:choose>  
       </table>

    </div> <!-- /container -->
  </body>
</html>