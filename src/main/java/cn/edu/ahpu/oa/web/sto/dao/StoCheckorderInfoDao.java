package cn.edu.ahpu.oa.web.sto.dao;


import java.text.SimpleDateFormat;
import java.util.Date;
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
import cn.edu.ahpu.oa.web.model.StoCheckorderInfo;


/**
 * sto_checkorder_info DAO
 * @author            
 * @since             2015-01-14
 */
@Repository
public class StoCheckorderInfoDao
extends HibernateBaseDaoImpl<StoCheckorderInfo, Long>
{
	@Autowired
	private NamedParameterJdbcPager jdbcPager;
	
	SimpleDateFormat dateFormatMin = new SimpleDateFormat("yyyy-MM-dd 00:00:00");
	SimpleDateFormat dateFormatMax = new SimpleDateFormat("yyyy-MM-dd 23:59:59");
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public Pagination<Map<String, Object>> pageFindCheckorderInfo(Integer start, Integer limit, StoCheckorderInfo entity,Date startDate,Date endDate) {
		Map<String, Object> paramMap = new HashMap<String, Object>();
		String sql = " SELECT "+
				"  t1.BUSI_ID as \"busiId\", "+
				"   t1.TITLE as \"titleCode\", "+
				"   t1.CONTENT  as \"content\", "+
				"   t1.RECEIVER_NAME as   \"receiverName\", "+
				"   t1.TEL_NO as  \"telNo\", "+
				"   t1.ORDER_NUM as  \"orderNum\", "+
				"   t1.ADDRESS  as \"address\", "+
				"   t1.POSTCODE  as \"postcode\", "+
				"   t1.QUICK_MSG as \"quickMsg\", "+
				"   t1.CREATE_TIME as \"createTime\", "+
//				"   t1.CREATE_USER as \"createUser\", "+
				"   t3.user_name as \"createUser\", "+
				"   t1.CHECK_TIME as \"checkTime\", "+
//				"   t1.CHECK_USER as \"checkUser\", "+
				"   t4.user_name as \"checkUser\", "+
				"   t1.STATUS as \"status\", "+
				"   t1.DEL_FLAG as \"delFlag\", "+
				"   t2.TITLE_CONTENT  as \"titleContent\" ,"+
				"   t2.EXPIRATION_DAYS  as \"expirationDays\" "+
				" FROM sto_checkorder_info t1 left join tpc_user t3 on t1.CREATE_USER = t3.user_code" +
				" left join tpc_user t4 on t1.CHECK_USER = t4.user_code,sto_checkorder_title t2 "+
				" WHERE t1.TITLE = t2.TITLE_CODE "+
				" AND t1.DEL_FLAG = 0 "+
				" AND t2.DEL_FLAG = 0 ";
			if(entity != null){
				
				if(StringUtils.hasText(entity.getTitle())){
					sql += " and t1.title = :title";
					paramMap.put("title", entity.getTitle());
				}
				
				if(StringUtils.hasText(entity.getReceiverName())){
					sql += " and t1.RECEIVER_NAME = :receiverName";
					paramMap.put("receiverName", entity.getReceiverName());
				}
				

				if(StringUtils.hasText(entity.getOrderNum())){
					sql += " and t1.ORDER_NUM = :orderNum";
					paramMap.put("orderNum", entity.getOrderNum());
				}
				
				if(StringUtils.hasText(entity.getTelNo())){
					sql += " and t1.TEL_NO = :telNo";
					paramMap.put("telNo", entity.getTelNo());
				}
				
				if(entity.getStatus() != null && entity.getStatus() >= 0){
					sql += " and t1.status = :status";
					paramMap.put("status", entity.getStatus());
				}
			}
			
			if(startDate != null && endDate != null){
				sql += " and t1.create_time between :startDate and :endDate";
				paramMap.put("startDate", dateFormatMin.format(startDate));
				paramMap.put("endDate", dateFormatMax.format(endDate));
			}else if(startDate != null){
				sql += " and t1.create_time between :startDate and :endDate";
				paramMap.put("startDate", dateFormatMin.format(startDate));
				paramMap.put("endDate", dateFormatMax.format(startDate));
			}else if(endDate != null){
				sql += " and t1.create_time between :startDate and :endDate";
				paramMap.put("startDate", dateFormatMin.format(endDate));
				paramMap.put("endDate", dateFormatMax.format(endDate));
			}
			
			sql += " order by t1.status,t1.create_time ,t2.EXPIRATION_DAYS";
			return jdbcPager.queryPage(sql, start, limit,paramMap);
	}
	

	public List<StoCheckorderInfo> listEntitieByOrderNum(String orderNum) {
		String hql = " from StoCheckorderInfo where delFlag = 0 and orderNum = ?";
		return this.findByHQL(hql, orderNum);
	}

	public Map<String, Object> getEntityBusiInfo(Long busiId) {
		String sql = " SELECT "+
				"  t1.BUSI_ID as \"busiId\", "+
				"   t1.TITLE as \"titleCode\", "+
				"   t1.CONTENT  as \"content\", "+
				"   t1.RECEIVER_NAME as   \"receiverName\", "+
				"   t1.TEL_NO as  \"telNo\", "+
				"   t1.ORDER_NUM as  \"orderNum\", "+
				"   t1.ADDRESS  as \"address\", "+
				"   t1.POSTCODE  as \"postcode\", "+
				"   t1.QUICK_MSG as \"quickMsg\", "+
				"   t1.CREATE_TIME as \"createTime\", "+
//				"   t1.CREATE_USER as \"createUser\", "+
				"   t3.user_name as \"createUser\", "+
				"   t1.CHECK_TIME as \"checkTime\", "+
//				"   t1.CHECK_USER as \"checkUser\", "+
				"   t4.user_name as \"checkUser\", "+

				"   t1.STATUS as \"status\", "+
				"   t1.DEL_FLAG as \"delFlag\", "+
				"   t2.TITLE_CONTENT  as \"titleContent\" "+
				" FROM sto_checkorder_info t1 left join tpc_user t3 on t1.CREATE_USER = t3.user_code" +
				" left join tpc_user t4 on t1.CHECK_USER = t4.user_code,sto_checkorder_title t2 "+
				" WHERE t1.TITLE = t2.TITLE_CODE " +
				" AND t1.DEL_FLAG = 0 "+
				" AND t2.DEL_FLAG = 0 " +
				" and t1.busi_id = ?";
		List<Map<String,Object>> infoList = jdbcTemplate.queryForList(sql,busiId);
		if(infoList != null && infoList.size() > 0){
			return infoList.get(0);
		}
		return null;
	}
}

