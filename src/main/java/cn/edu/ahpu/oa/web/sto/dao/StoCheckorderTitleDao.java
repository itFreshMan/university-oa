package cn.edu.ahpu.oa.web.sto.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import cn.edu.ahpu.common.dao.hibernate4.HibernateBaseDaoImpl;
import cn.edu.ahpu.common.dao.jdbc.NamedParameterJdbcPager;
import cn.edu.ahpu.common.dao.support.Pagination;
import cn.edu.ahpu.oa.web.model.StoCheckorderTitle;


/**
 * sto_checkorder_title DAO
 * @author            
 * @since             2015-01-14
 */
@Repository
public class StoCheckorderTitleDao
   extends HibernateBaseDaoImpl<StoCheckorderTitle, Long>
{
	@Autowired
	private NamedParameterJdbcPager jdbcPager;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public Pagination<Map<String, Object>> pageFindCheckorderTitles(
			Integer start, Integer limit, String titleCode, String titleContent) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		String sql = " SELECT "+
				"  BUSI_ID as \"busiId\", "+
				" 	  TITLE_CODE as \"titleCode\", "+
				" 	  TITLE_CONTENT as \"titleContent\", "+
				" 	  EXPIRATION_DAYS as \"expirationDays\", "+
				" 	  DEL_FLAG as \"delFlag\""+
				" 	FROM sto_checkorder_title" +
				" where del_flag= 0";
		if(StringUtils.hasText(titleCode)){
			sql += " and TITLE_CODE = :titleCode";
			paramMap.put("titleCode", titleCode);
		}
		
		if(StringUtils.hasText(titleContent)){
			sql += " and TITLE_CONTENT = :titleContent";
			paramMap.put("titleContent", titleContent);
		}
		return jdbcPager.queryPage(sql, start, limit,paramMap);
	}

	public List<StoCheckorderTitle> checkExistUniqueCode(String titleCode) {
		String hql = " from StoCheckorderTitle where delFlag=0 and titleCode = ?";
		return this.findByHQL(hql, titleCode);
	}
}

