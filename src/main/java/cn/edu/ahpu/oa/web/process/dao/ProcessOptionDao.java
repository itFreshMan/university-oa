package cn.edu.ahpu.oa.web.process.dao;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import cn.edu.ahpu.common.dao.hibernate4.HibernateBaseDaoImpl;
import cn.edu.ahpu.oa.web.model.OaProcessOption;

@Repository
public class ProcessOptionDao extends HibernateBaseDaoImpl<OaProcessOption, Long>{
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@SuppressWarnings("unchecked")
	public List<Map<String,Object>> getProcessOptionList(String processType,String businessKey) {
		String hql = "select new Map(t.actName as actName , b.userName as userName, " +
				" t.optionName as optionName,t.optionContent as optionContent,t.approveTime as approveTime)from OaProcessOption t ,User b where t.approveUser = b.userCode and t.processType = ? and t.businessKey = ? order by t.opinionId asc";
		return this.findByHQL(hql, processType , businessKey);
	}
}
