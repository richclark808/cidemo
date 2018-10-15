package pageobjects;

import java.util.List;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import com.provar.core.testapi.annotations.*;

@Page( title="MyPageObject"                                
     , summary=""
     , relativeUrl=""
     , connection="GoogleSearch"
     )             
public class MyPageObject {

	@TextType()
	@FindBy(xpath = "//input[@name=\"q\"]")
	public WebElement Search;
	
			
}
