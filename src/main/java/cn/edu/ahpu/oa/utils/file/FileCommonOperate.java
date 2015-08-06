package cn.edu.ahpu.oa.utils.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

/**
 * 
 * @Description : 方法工具类
 * @Author : JHS
 * @Date : 2015年7月24日 上午8:43:29
 */
public class FileCommonOperate {

	/**
	 * 
	 * @param inputStream 待上传文件的输入流
	 * @param path 上传目标路径
	 * @param fileName 上传后文件名
	 * @return
	 */
	public static String uploadFile(InputStream inputStream, String path, String fileName) {
		try {
			File file = createFile(path, fileName);
			OutputStream outputStream = new FileOutputStream(file);			
			try {
				IOUtils.copyLarge(inputStream, outputStream);
			} finally {
				outputStream.close();
			}			
			return file.getName();
		} catch (IOException e) {
			throw new IllegalArgumentException("Could not add record", e);
		}
	}	
	
	private static File createFile(String path, String fileName) {
	 	File file = new File(path);
	 	if(!file.exists())
	 		file.mkdirs();
	 	file = new File(path, fileName);
	  	return file;
	}
	
	/**
	 * 下载文件
	 * @param request 
	 * @param response
	 * @param filePath 完整文件路径(包含文件名)
	 * @param saveFileName 下载时保存到本地的文件名
	 * @throws UnsupportedEncodingException
	 */
	public static void downLoadFile(HttpServletRequest request, HttpServletResponse response, String filePath, String saveFileName) throws UnsupportedEncodingException {
		String userAgent = request.getHeader("User-Agent");
	 	if (userAgent.toLowerCase().indexOf("firefox") > 0) {
	 		saveFileName = new String(saveFileName.getBytes("UTF-8"),"ISO8859-1");// firefox浏览器
		} else if (userAgent.toUpperCase().indexOf("MSIE") > 0) {
			saveFileName = URLEncoder.encode(saveFileName, "UTF-8");// IE浏览器
		}else if (userAgent.toLowerCase().indexOf("chrome") > 0 || userAgent.toLowerCase().indexOf("safari") > 0 ) {
			saveFileName = new String(saveFileName.getBytes("UTF-8"),"ISO8859-1");// firefox浏览器
		} else {
			saveFileName = URLEncoder.encode(saveFileName, "UTF-8");
		}
	 	
		FileInputStream fis = null;
		OutputStream os = null;
		try {
			fis = new FileInputStream(new File(filePath));
			response.setHeader("Content-Disposition", "attachment; filename=\""+ saveFileName + "\""); 
			response.setContentType("application/octet-stream");
			os = response.getOutputStream();
			byte[] b = new byte[1024];
			int i = 0;
			while ((i = fis.read(b)) > 0) {
			    os.write(b, 0, i);
			}		
		} catch (FileNotFoundException e) {
//			e.printStackTrace();
			System.out.println("------------->"+filePath+" not found;");
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				os.flush();
				fis.close();
				os.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	
	public static void multiFilesToZip(List<String> filePathAndNames,String zipFilePath ,String zipFileName){
		String zipPathAndName = zipFilePath+ File.separator+zipFileName;
		byte[] buffer = new byte[1024]; 
		ZipOutputStream out = null;
		FileInputStream fis = null;
		try {
			File f = new File(zipFilePath);
			if(!f.exists()){
				f.mkdirs();
			}
			f = new File(zipPathAndName);
			if(!f.exists()){
				f.createNewFile();
			}
			
			out = new ZipOutputStream(new FileOutputStream(zipPathAndName));
			
			out.setEncoding( "GBK");
//			System.out.println("------------------>>>>"+zipPathAndName+" -- "+out.getEncoding()+"<<<<------------------");
			
			if(filePathAndNames != null && filePathAndNames.size() > 0){
				for(String fileCodeAndPath : filePathAndNames){
					File file = new File(fileCodeAndPath);
					if(!file.exists()){
						continue;
					}
					fis = new FileInputStream(new File(fileCodeAndPath)); 
					String fileCode = fileCodeAndPath.substring(fileCodeAndPath.lastIndexOf(zipFilePath)+zipFilePath.length()+1);
					out.putNextEntry(new ZipEntry(fileCode));
					int len;    
	                // 读入需要下载的文件的内容，打包到zip文件    
	                while ((len = fis.read(buffer)) > 0) {    
	                    out.write(buffer, 0, len);    
	                }    
	                out.closeEntry();    
	                fis.close();
				}
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			if(out != null){
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			
			if(fis != null){
				try {
					fis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	public static void removeDir(File dir){
		if(!dir.exists() ){
			return ;
		}
		
		if(dir.isFile()){
			dir.delete();
			return ;
		}
		
		if(dir.isDirectory()){
			File[] children = dir.listFiles();
			if(children != null && children.length > 0){
				for(File child : children){
					removeDir(child);
				}
			}
			dir.delete();
		}
		
	}
	
	public static boolean clientIsWindows(){
		String osname = System.getProperty("os.name");
        return osname != null &&  osname.toLowerCase().contains("windows") ? true :false;
	}
	
	public static void main(String[] args) {
	/*	try {
			FileInputStream fileInputStream = new FileInputStream(new File("D:" + File.separator + "ttt.txt"));
			String temp = uploadFile(fileInputStream, "d:/temz", "zzp123321.txt");
			System.out.println(temp);

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}*/
		clientIsWindows();
		
	}
}
