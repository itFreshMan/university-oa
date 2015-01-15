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
 * sto_checkorder_details
 * @author 
 * @since  2015-01-14
 */
@Entity
@Table(name="sto_checkorder_details")
public class StoCheckorderDetails implements Serializable{
	
	/**BUSI_ID*/
	private Long busiId;
	
	/**CHECKORDER_ID*/
	private Long checkorderId;
	
	/**CHECK_TIME*/
	private java.util.Date checkTime;
	
	/**CHECK_USER*/
	private String checkUser;
	
	/*1:检查,2.加急,3:异常故障,4:正常*/
	private Integer checkType;
	
	/**CHECK_CONTENT*/
	private String checkContent;
	
	/**CHECK_REPLY*/
	private String checkReply;
	
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
	
	@Column(name="CHECKORDER_ID", length=19, nullable=false)
	public Long getCheckorderId() {
		return checkorderId;
	}
	
	public void setCheckorderId(Long checkorderId) {
		this.checkorderId = checkorderId;
	}
	
	@Column(name="CHECK_TIME", length=19, nullable=false)
	public java.util.Date getCheckTime() {
		return checkTime;
	}
	
	public void setCheckTime(java.util.Date checkTime) {
		this.checkTime = checkTime;
	}
	
	@Column(name="CHECK_USER", length=64, nullable=false)
	public String getCheckUser() {
		return checkUser;
	}
	
	public void setCheckUser(String checkUser) {
		this.checkUser = checkUser;
	}
	
	@Column(name="CHECK_TYPE", length=10, nullable=true)
	public Integer getCheckType() {
		return checkType;
	}
	
	public void setCheckType(Integer checkType) {
		this.checkType = checkType;
	}
	
	@Column(name="CHECK_CONTENT", length=512, nullable=true)
	public String getCheckContent() {
		return checkContent;
	}
	
	public void setCheckContent(String checkContent) {
		this.checkContent = checkContent;
	}
	
	@Column(name="CHECK_REPLY", length=512, nullable=true)
	public String getCheckReply() {
		return checkReply;
	}
	
	public void setCheckReply(String checkReply) {
		this.checkReply = checkReply;
	}
	
	@Column(name="DEL_FLAG", length=10, nullable=true)
	public Integer getDelFlag() {
		return delFlag;
	}
	
	public void setDelFlag(Integer delFlag) {
		this.delFlag = delFlag;
	}
	
}
