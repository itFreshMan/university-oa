package cn.edu.ahpu.oa.webservice.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import cn.edu.ahpu.oa.webservice.model.Person;
import cn.edu.ahpu.oa.webservice.service.IPersonService;
import cn.edu.ahpu.tpc.framework.web.dao.admin.UserDao;
import cn.edu.ahpu.tpc.framework.web.model.admin.User;

public class IPersonServiceImpl implements IPersonService {
	private UserDao userDao;

	public UserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	public List<Person> listPersonInfo() {
		List<User> users = userDao.loadAll();
		return convertUsers2Persons(users);
	}

	@SuppressWarnings("unchecked")
	public Person getPerson(String code) {
		List<User> users = userDao.findByHQL(
				"from User u where u.userCode = ?", code);
		List<Person> persons = convertUsers2Persons(users);
		return persons != null && persons.size() > 0 ? persons.get(0) : null;
	}

	public String showPersonInfo(Person p) {
		return "[id:" + p.getId() + ",name:" + p.getName() + ",code:"
				+ p.getCode() + ",birthdate:"
				+ new SimpleDateFormat("yyyy-MM-dd").format(p.getBirthdate())
				+ "]";
	}

	private List<Person> convertUsers2Persons(List<User> users) {
		List<Person> persons = new ArrayList<Person>();
		if (users != null && !users.isEmpty()) {
			for (User u : users) {
				Person p = new Person(u.getId(), u.getUserName(),
						u.getUserCode(), u.getCreateTime());
				persons.add(p);
			}
		}
		return persons;
	}
}
