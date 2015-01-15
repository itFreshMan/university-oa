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
}

