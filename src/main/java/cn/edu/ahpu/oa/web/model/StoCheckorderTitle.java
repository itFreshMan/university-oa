package cn.edu.ahpu.oa.web.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Embeddable;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;

import org.hibernate.annotations.GenericGenerator;



/**
 * sto_checkorder_title
 * @author 
 * @since  2015-01-15
 */
@Entity
@Table(name="sto_checkorder_title")
public class StoCheckorderTitle implements Serializable{
	
	/**BUSI_ID*/
	private Long busiId;
	
	/**TITLE_CODE*/
	private String titleCode;
	
	/**TITLE_CONTENT*/
	private String titleContent;
	
	/**默认自动过期时间*/
	private Integer expirationDays;
	
	/**0:未删除,1:已删除*/
	private Integer delFlag;
	
	@Id
    @GeneratedValue(generator = "tableGenerator")     
	 @GenericGenerator(name = "tableGenerator", strategy="cn.edu.ahpu.common.dao.key.SequenceGenerator")
    @Column(name="BUSI_ID", length=19, nullable=false)
	public Long getBusiId() {
		return busiId;
	}
	
	public void setBusiId(Long busiId) {
		this.busiId = busiId;
	}
	
	@Column(name="TITLE_CODE", length=8, nullable=false)
	public String getTitleCode() {
		return titleCode;
	}
	
	public void setTitleCode(String titleCode) {
		this.titleCode = titleCode;
	}
	
	@Column(name="TITLE_CONTENT", length=32, nullable=false)
	public String getTitleContent() {
		return titleContent;
	}
	
	public void setTitleContent(String titleContent) {
		this.titleContent = titleContent;
	}
	
	@Column(name="EXPIRATION_DAYS", length=10, nullable=true)
	public Integer getExpirationDays() {
		return expirationDays;
	}
	
	public void setExpirationDays(Integer expirationDays) {
		this.expirationDays = expirationDays;
	}
	
	@Column(name="DEL_FLAG", length=10, nullable=true)
	public Integer getDelFlag() {
		return delFlag;
	}
	
	public void setDelFlag(Integer delFlag) {
		this.delFlag = delFlag;
	}
	
}
