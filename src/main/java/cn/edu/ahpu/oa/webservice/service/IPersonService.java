package cn.edu.ahpu.oa.webservice.service;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import cn.edu.ahpu.oa.webservice.model.Person;

//@WebService(targetNamespace = "http://www.kuaidi100.com/")
@Path(value="/person")
public interface IPersonService {
	
	@GET
	@Path(value="/list")
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Person> listPersonInfo();
	
	@GET
	@Path(value="/bean/{code}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Person getPerson(@PathParam("code")  String code);
	
	@GET
	@Path(value="/bean/{code}")
	@Produces({ MediaType.APPLICATION_XML })
	public String showPersonInfo(Person p);
}
