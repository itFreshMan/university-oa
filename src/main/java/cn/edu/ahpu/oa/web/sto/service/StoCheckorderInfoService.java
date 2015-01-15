package cn.edu.ahpu.oa.web.sto.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.edu.ahpu.common.dao.support.Pagination;
import cn.edu.ahpu.oa.web.model.StoCheckorderDetails;
import cn.edu.ahpu.oa.web.model.StoCheckorderInfo;
import cn.edu.ahpu.oa.web.model.StoCheckorderTitle;
import cn.edu.ahpu.oa.web.sto.dao.StoCheckorderDetailsDao;
import cn.edu.ahpu.oa.web.sto.dao.StoCheckorderInfoDao;
import cn.edu.ahpu.tpc.framework.core.util.ResponseData;
import cn.edu.ahpu.tpc.framework.core.util.SecurityContextUtil;
import cn.edu.ahpu.tpc.framework.web.model.admin.User;

/**
 * sto_checkorder_info Service
 *
 * @author            
 * @since             2015-01-14
 */

@Service
public class StoCheckorderInfoService {
    @Autowired
    private StoCheckorderInfoDao dao;
    
    @Autowired
    private StoCheckorderDetailsDao detailsDao;

	public Pagination<Map<String, Object>> pageFindCheckorderInfo(Integer start, Integer limit, StoCheckorderInfo entity,Date startDate,Date endDate) {
		return dao.pageFindCheckorderInfo(start, limit,entity,startDate,endDate);
	}
	

	@Transactional
	public ResponseData insertEntity(StoCheckorderInfo entity) {
		String orderNum  = entity.getOrderNum();
		List<StoCheckorderInfo> sameOrderNumList = dao.listEntitieByOrderNum(orderNum);
		if(sameOrderNumList != null && sameOrderNumList.size() > 0){
			return new ResponseData(false,"订单号("+orderNum+")已经存在查单记录");
		}
 		User curUser = SecurityContextUtil.getCurrentUser();
		Date curDate = new Date();
		entity.setBusiId(0l);
		entity.setDelFlag(0);
		entity.setStatus(0);
		entity.setCreateTime(curDate);
		entity.setCreateUser(curUser.getUserCode());
		
		dao.save(entity);
		
		return ResponseData.SUCCESS_NO_DATA;
	}

/*	@Transactional
	public ResponseData updateEntity(StoCheckorderInfo entity) {
		StoCheckorderInfo dbEntity = dao.get(entity.getBusiId());
		if(dbEntity == null){
			 return new ResponseData(false,"改条记录busiId("+entity.getBusiId()+")不存在");
		}
		  
		return  ResponseData.SUCCESS_NO_DATA;
	}*/
	
	/**
	 * 发起检查申请
	 * @param entity
	 * @return
	 */
	@Transactional
	public ResponseData checkNowByStoUser(StoCheckorderDetails detailsEntity) {
		StoCheckorderInfo dbEntity = dao.get(detailsEntity.getCheckorderId());
		User curUser = SecurityContextUtil.getCurrentUser();
		Date curDate = new Date();
		dbEntity.setCheckTime(curDate);
		dbEntity.setCheckUser(curUser.getUserCode());
		
		Integer checkType = detailsEntity.getCheckType();
		dbEntity.setStatus(checkType);///**1:检查,2:.加急*/
		
		//sto_checkorder_details 表中增加记录;
//		StoCheckorderDetails detailsEntity = new StoCheckorderDetails();
		detailsEntity.setBusiId(0l);
//		detailsEntity.setCheckorderId(busiId);
		detailsEntity.setCheckTime(curDate);
		detailsEntity.setCheckUser(curUser.getUserCode());
		detailsEntity.setCheckType(checkType);/**1:检查,2:.加急*/
		detailsEntity.setDelFlag(0);
		detailsDao.save(detailsEntity);
		return  ResponseData.SUCCESS_NO_DATA;
	}
	
	/**
	 * 更改状态
	 * @param busiId
	 * @param status
	 * @return
	 */
	public ResponseData changeStatus(Long busiId, Integer status) {
		StoCheckorderInfo dbEntity = dao.get(busiId);
		dbEntity.setStatus(status);
		dao.update(dbEntity);
		return  ResponseData.SUCCESS_NO_DATA;
	}
	
	
	@Transactional
	public void delete(Long[] ids) {
		if(ids != null && ids.length > 0){
			for(Long busiId : ids){
				StoCheckorderInfo dbEntity = dao.get(busiId);
				dbEntity.setDelFlag(1);
				dao.update(dbEntity);
			}
		}
	}

	public StoCheckorderInfo getEntityById(Long busiId) {
		return dao.get(busiId);
	}


	public Map<String, Object> getEntityBusiInfo(Long busiId) {
		return dao.getEntityBusiInfo(busiId);
	}


}
   

