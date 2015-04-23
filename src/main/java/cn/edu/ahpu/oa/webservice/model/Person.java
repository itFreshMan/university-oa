package cn.edu.ahpu.oa.webservice.model;

import java.util.Date;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "PersonInfo")
public class Person {
	private Long id;
	private String name;
	private String code;
	private Date birthdate;

	public Person() {
		super();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Date getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(Date birthdate) {
		this.birthdate = birthdate;
	}

	public Person(Long id, String name, String code, Date birthdate) {
		super();
		this.id = id;
		this.name = name;
		this.code = code;
		this.birthdate = birthdate;
	}

}
