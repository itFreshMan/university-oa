package cn.edu.ahpu.oa.web.process.dao;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import cn.edu.ahpu.common.dao.hibernate4.HibernateBaseDaoImpl;
import cn.edu.ahpu.common.dao.jdbc.NamedParameterJdbcPager;
import cn.edu.ahpu.common.dao.support.Pagination;
import cn.edu.ahpu.oa.utils.OaConstants;
import cn.edu.ahpu.oa.web.model.OaProcessOption;

@Repository
public class ProcessApiDao extends HibernateBaseDaoImpl<OaProcessOption, Long>{
	
	@Autowired
	private NamedParameterJdbcPager jdbcPager;

	public Pagination<Map<String, Object>> getMyProcess(Integer start,
			Integer limit, String processKey,String userCode) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("leaveBillKey", OaConstants.LEAVE_BILL_PROCESS_KEY);
		paramMap.put("userCode", userCode);
		StringBuffer sql = new StringBuffer("select tt.START_USER_ID_ as \"START_USER_ID_\"," +
				"tt.PROC_DEF_ID_ as \"processDefinitionId\",tt.PROC_INST_ID_ as \"processInstanceId\"," +
				"tt.BUSINESS_KEY_ as \"businessKey\",tt.START_TIME_ as \"startTime\",tt.END_TIME_ as \"endTime\"," +
				"tt.DELETE_REASON_ as \"deleteReason\",tt.KEY_ as \"key\",tt.TITLE as \"title\",tt.REMARK as \"remark\"," +
				"tt.STATUS as \"status\" from");
		sql.append(" (");
		sql.append("select t.START_USER_ID_,t.PROC_DEF_ID_,t.PROC_INST_ID_,t.BUSINESS_KEY_,t.START_TIME_,t.END_TIME_," +
					"t.DELETE_REASON_,g.KEY_,b.TITLE,b.REMARK,b.STATUS" +
					" from ACT_HI_PROCINST t left join ACT_RE_PROCDEF g on t.PROC_DEF_ID_ = g.ID_" +
					" left join oa_busi_leave b on t.BUSINESS_KEY_ = b.BUSI_ID where g.KEY_=:leaveBillKey");
		/*
		sql.append(" union all");
		sql.append(" select t.START_USER_ID_,t.PROC_DEF_ID_,t.PROC_INST_ID_,t.BUSINESS_KEY_,t.START_TIME_,t.END_TIME_," +
				"t.DELETE_REASON_,g.KEY_,b.TITLE,b.REMARK,b.STATUS" +
				" from ACT_HI_PROCINST t left join ACT_RE_PROCDEF g on t.PROC_DEF_ID_ = g.ID_" +
				" left join OA_BUSI_HOLIDAY b on t.BUSINESS_KEY_ = b.BUSI_ID where g.KEY_=:leaveKey");
		*/
		sql.append(") tt");
		sql.append(" where tt.START_USER_ID_ = :userCode");
		if(StringUtils.hasText(processKey) && !processKey.equals("-1")) {
			paramMap.put("processKey", processKey);
			sql.append(" and tt.KEY_ = :processKey");
		}
		sql.append(" order by tt.START_TIME_ desc");
		return jdbcPager.queryPage(sql.toString(), start, limit, paramMap);
	}
}
