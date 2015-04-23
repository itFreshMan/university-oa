package cn.edu.ahpu.oa.webservice.service;

import javax.jws.WebService;

@WebService(targetNamespace = "http://www.kuaidi100.com/")
public interface IExpressService {
	//接口中的变量默认为 静态变量;
	public String URL = "http://www.kuaidi100.com/query";
	
	public String showDetails(String type, String postid);

	public String showSTODetails(String postid);
}
