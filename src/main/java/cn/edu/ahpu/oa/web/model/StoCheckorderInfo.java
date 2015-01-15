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
 * sto_checkorder_info
 * @author 
 * @since  2015-01-14
 */
@Entity
@Table(name="sto_checkorder_info")
public class StoCheckorderInfo implements Serializable{
	
	/**BUSI_ID*/
	private Long busiId;
	
	/**TITLE*/
	private String title;
	
	/**CONTENT*/
	private String content;
	
	/**RECEIVER_NAME*/
	private String receiverName;
	
	/**TEL_NO*/
	private String telNo;
	
	/**ORDER_NUM*/
	private String orderNum;
	
	/**ADDRESS*/
	private String address;
	
	/**POSTCODE*/
	private String postcode;
	
	/**QUICK_MSG*/
	private String quickMsg;
	
	/**CREATE_TIME*/
	private java.util.Date createTime;
	
	/**CREATE_USER*/
	private String createUser;
	
	/**CHECK_TIME*/
	private java.util.Date checkTime;
	
	/**CHECK_USER*/
	private String checkUser;
	
	/*0:新建,1:检查,2.加急,3:异常故障,4:正常*/
	private Integer status;
	
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
	
	@Column(name="TITLE", length=8, nullable=false)
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	@Column(name="CONTENT", length=255, nullable=true)
	public String getContent() {
		return content;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
	@Column(name="RECEIVER_NAME", length=255, nullable=false)
	public String getReceiverName() {
		return receiverName;
	}
	
	public void setReceiverName(String receiverName) {
		this.receiverName = receiverName;
	}
	
	@Column(name="TEL_NO", length=16, nullable=false)
	public String getTelNo() {
		return telNo;
	}
	
	public void setTelNo(String telNo) {
		this.telNo = telNo;
	}
	
	@Column(name="ORDER_NUM", length=16, nullable=false)
	public String getOrderNum() {
		return orderNum;
	}
	
	public void setOrderNum(String orderNum) {
		this.orderNum = orderNum;
	}
	
	@Column(name="ADDRESS", length=255, nullable=true)
	public String getAddress() {
		return address;
	}
	
	public void setAddress(String address) {
		this.address = address;
	}
	
	@Column(name="POSTCODE", length=6, nullable=true)
	public String getPostcode() {
		return postcode;
	}
	
	public void setPostcode(String postcode) {
		this.postcode = postcode;
	}
	
	@Column(name="QUICK_MSG", length=512, nullable=true)
	public String getQuickMsg() {
		return quickMsg;
	}
	
	public void setQuickMsg(String quickMsg) {
		this.quickMsg = quickMsg;
	}
	
	@Column(name="CREATE_TIME", length=19, nullable=true)
	public java.util.Date getCreateTime() {
		return createTime;
	}
	
	public void setCreateTime(java.util.Date createTime) {
		this.createTime = createTime;
	}
	
	@Column(name="CREATE_USER", length=64, nullable=true)
	public String getCreateUser() {
		return createUser;
	}
	
	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}
	
	@Column(name="CHECK_TIME", length=19, nullable=true)
	public java.util.Date getCheckTime() {
		return checkTime;
	}
	
	public void setCheckTime(java.util.Date checkTime) {
		this.checkTime = checkTime;
	}
	
	@Column(name="CHECK_USER", length=64, nullable=true)
	public String getCheckUser() {
		return checkUser;
	}
	
	public void setCheckUser(String checkUser) {
		this.checkUser = checkUser;
	}
	
	@Column(name="STATUS", length=10, nullable=true)
	public Integer getStatus() {
		return status;
	}
	
	public void setStatus(Integer status) {
		this.status = status;
	}
	
	@Column(name="DEL_FLAG", length=10, nullable=true)
	public Integer getDelFlag() {
		return delFlag;
	}
	
	public void setDelFlag(Integer delFlag) {
		this.delFlag = delFlag;
	}
	
}
