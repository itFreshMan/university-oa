package cn.edu.ahpu.oa.web.sto.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import cn.edu.ahpu.common.dao.support.Pagination;
import cn.edu.ahpu.oa.web.model.StoCheckorderTitle;
import cn.edu.ahpu.oa.web.sto.dao.StoCheckorderTitleDao;
import cn.edu.ahpu.tpc.framework.core.util.ResponseData;

/**
 * sto_checkorder_title Service
 *
 * @author            
 * @since             2015-01-14
 */

@Service
public class StoCheckorderTitleService  {
    @Autowired
    private StoCheckorderTitleDao dao;

	public Pagination<Map<String, Object>> pageFindCheckorderTitles(
			Integer start, Integer limit, String titleCode, String titleContent) {
		return dao.pageFindCheckorderTitles(start, limit,titleCode,titleContent);
	}
	
	public StoCheckorderTitle getEntityById(Long busiId){
		return dao.get(busiId);
	}

	@Transactional
	public ResponseData insertEntity(StoCheckorderTitle entity) {
		if(entity == null || StringUtils.isEmpty(entity.getTitleCode()) || StringUtils.isEmpty(entity.getTitleContent())){
			return new ResponseData(false,"主题编码或者主题名称为空");
		}
		List<StoCheckorderTitle> checkExistUniqueCode = dao.checkExistUniqueCode(entity.getTitleCode());
		if(checkExistUniqueCode == null || checkExistUniqueCode.isEmpty()){
			entity.setBusiId(0l);
			entity.setDelFlag(0);
			dao.save(entity);
			return ResponseData.SUCCESS_NO_DATA;
		}
		return new ResponseData(false,"主题编码("+entity.getTitleCode()+")已经存在");
	}
	
	@Transactional
	public void updateEntity(StoCheckorderTitle entity){
		dao.update(entity);
	}

	@Transactional
	public void delete(Long[] ids) {
		if(ids != null && ids.length > 0){
			for(Long busiId : ids){
				StoCheckorderTitle entity = dao.get(busiId);
				entity.setDelFlag(1);
				dao.update(entity);
			}
		}
		
	}
	
}

  

