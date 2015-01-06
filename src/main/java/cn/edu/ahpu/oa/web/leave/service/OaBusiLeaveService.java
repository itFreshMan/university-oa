package cn.edu.ahpu.oa.web.leave.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.edu.ahpu.oa.web.leave.dao.OaBusiLeaveDao;
import cn.edu.ahpu.oa.web.model.OaBusiLeave;
import cn.edu.ahpu.tpc.framework.core.util.SecurityContextUtil;
import cn.edu.ahpu.tpc.framework.web.model.admin.User;

/**
 * oa_busi_leave Service
 * 
 * @author
 * @since 2014-12-23
 */

@Service
public class OaBusiLeaveService {
	@Autowired
	private OaBusiLeaveDao dao;

	@Transactional
	public void addBusiLeave(OaBusiLeave entity) {
		User curUser = SecurityContextUtil.getCurrentUser();
		entity.setCreateUser(curUser.getId().intValue());
		entity.setCreateTime(new Date());
		entity.setOrgId(curUser.getOrgId());
		entity.setDelFlag(0);
		entity.setStatus(0);
		
		dao.save(entity);
	}


}
