package cn.edu.ahpu.oa.webservice.service;

import javax.jws.WebService;

@WebService(targetNamespace = "http://www.kuaidi100.com/")
public class HelloService {
	
	public String sayHello(String name){
		return "hello : " +name;
	}
}
