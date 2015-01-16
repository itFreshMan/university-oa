package cn.edu.ahpu.oa.web.sto.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import cn.edu.ahpu.common.dao.hibernate4.HibernateBaseDaoImpl;
import cn.edu.ahpu.oa.web.model.StoCheckorderDetails;

/**
 * sto_checkorder_details DAO
 * @author            
 * @since             2015-01-14
 */
@Repository
public class StoCheckorderDetailsDao
  extends HibernateBaseDaoImpl<StoCheckorderDetails, Long>
{

	public List<StoCheckorderDetails> listAllDetails(Long checkorderId) {
		String hql = " from StoCheckorderDetails where delFlag = 0 and checkorderId = ?";
		return this.findByHQL(hql, checkorderId);
	}
	
	public List<Map<String,Object>> listAllMapDetails(Long checkorderId) {
		String hql = " select new Map(t1.checkUser as checkUserCode,t2.userName as checkUser,t1.checkTime as checkTime,t1.checkType as checkType,t1.checkContent as checkContent,t1.checkReply as checkReply)from StoCheckorderDetails t1 ,User t2 where t1.checkUser = t2.userCode and t1.delFlag = 0 and t1.checkorderId = ?" +
				" order by t1.checkTime asc";
		return this.findByHQL(hql, checkorderId);
	}
}

