package cn.edu.ahpu.oa.web.process.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import cn.edu.ahpu.common.dao.hibernate4.HibernateBaseDaoImpl;
import cn.edu.ahpu.oa.utils.OAConstants;
import cn.edu.ahpu.oa.web.model.OaProcessOption;

@Repository
public class BusinessDao extends HibernateBaseDaoImpl<OaProcessOption, Long>{
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	/**
	 * 列出某一机构下的某一用户的所有角色编码
	 * @param userCode
	 * @param orgId
	 * @return
	 */
	public List<String> listAllRoleCode(String userCode,Long orgId){
		String sql = " SELECT "+
					" 	  t2.CODE as \"roleCode\" "+
					" 	FROM "+
					" 	  tpc_user t1, "+
					" 	  tpc_role t2, "+
					" 	  tpc_user_role t3  "+
					" 	WHERE t1.id = t3.user_id  "+
					" 	  AND t2.id = t3.ROLE_ID  "+
					" 	  AND t1.user_code = ?  "+
					" 	  AND t1.ORG_ID = ? "	;	
		return jdbcTemplate.queryForList(sql,String.class, userCode, orgId);
	}
	
	/**
	 * 列出某一机构下,某一角色的所有用户
	 * @param orgId
	 * @param roleCode
	 * @return
	 */
	public List<String> listUserCodesByOrgIdAndRoleCode(String roleCode,Long orgId){
		String sql = " SELECT "+
				"  t1.user_code as \"userCode\"  "+
				" FROM "+
				"   tpc_user t1, "+
				"   tpc_role t2, "+
				" 	  tpc_user_role t3  "+
				" 	WHERE t1.id = t3.user_id  "+
				" 	  AND t2.id = t3.ROLE_ID  "+
				"   AND t2.code = ?  "+
				" 	  AND t1.ORG_ID = ? ";
		return jdbcTemplate.queryForList(sql,String.class, roleCode, orgId);
	}

	/**
	 * 
	 * @param processKey
	 * @param processInstanceId
	 * @param businessKey
	 */
	 
	public void updateLeaveInfoAtStartProcess(String processKey,String processInstanceId,
			String businessKey) {
		String hql = "";
		if(processKey.equals(OAConstants.LEAVE_BILL_PROCESS_KEY)){
			hql = "update OaBusiLeave t set t.status='1',t.procInstId = ? where t.busiId = ?";
		}
		if(StringUtils.isNotEmpty(hql)){
			this.bulkUpdate(hql, processInstanceId, Long.valueOf(businessKey));
		}
	}
	
	
	/**
	 * 
	 * @Title: getBusinessInfo 
	 * @Description: 根据流程KEY和业务主键查找对应业务数据
	 * @param processKey
	 * @param businessKey
	 * @return
	 * @return List<Map<String,Object>>
	 * @throws
	 */
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> getBusinessInfo(String processKey, String businessKey) {
		String hql = "";
		if(processKey.equals(OAConstants.LEAVE_BILL_PROCESS_KEY)){
			hql = "select new Map(t.title as title, t.remark as remark,b.userName as userName,t.realTime as realTime,t.beginTime as beginTime," +
					"	t.endTime as endTime,t.orgId as orgId,c.name as orgName) from OaBusiLeave t,User b,Organization c" +
					" where t.createUser = b.id and t.orgId = c.id and t.busiId = ?";
		}
		if(StringUtils.isEmpty(hql)){
			return null;
		}
		return this.findByHQL(hql, Long.valueOf(businessKey));
	}
	
}
