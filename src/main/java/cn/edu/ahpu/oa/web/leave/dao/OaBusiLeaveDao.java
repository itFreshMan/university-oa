package cn.edu.ahpu.oa.web.leave.dao;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import cn.edu.ahpu.common.dao.hibernate4.HibernateBaseDaoImpl;
import cn.edu.ahpu.common.dao.jdbc.NamedParameterJdbcPager;
import cn.edu.ahpu.oa.web.model.OaBusiLeave;


/**
 * oa_busi_leave DAO
 * @author            
 * @since             2014-12-23
 */
@Repository
public class OaBusiLeaveDao extends HibernateBaseDaoImpl<OaBusiLeave, Long>{
	@Autowired
	private NamedParameterJdbcPager jdbcPager;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
 
}

