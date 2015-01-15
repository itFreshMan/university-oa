package cn.edu.ahpu.oa.web.sto.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cn.edu.ahpu.oa.web.model.StoCheckorderDetails;
import cn.edu.ahpu.oa.web.sto.dao.StoCheckorderDetailsDao;


/**
 * sto_checkorder_details Service
 *
 * @author            
 * @since             2015-01-14
 */

@Service
public class StoCheckorderDetailsService {
    @Autowired
    private StoCheckorderDetailsDao dao;

	public List<StoCheckorderDetails> listAllDetails(Long checkorderId) {
		return dao.listAllDetails(checkorderId);
	}
}
      
   

