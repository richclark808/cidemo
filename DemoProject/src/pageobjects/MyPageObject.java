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
	@TextType()
	@FindByLabel(label = "Search")
	public WebElement search;
	@LinkType()
	@FindBy(linkText = "Salesforce.com For Dummies, 6th Edition (For Dummies (Computer/Tech))")
	public WebElement salesforceComForDummies6ThEditionForDummiesComputerTech;
	@ButtonType()
	@FindByLabel(label = "Add to Cart")
	public WebElement addToCart;
	@LinkType()
	@FindBy(linkText = "Proceed to checkout (1 item)")
	public WebElement proceedToCheckout1Item;
	@ButtonType()
	@FindBy(id = "continue")
	public WebElement ContinueBtn;
	@TextType()
	@FindBy(xpath = "//span[@class='price-large']/../../..//span[@id='newBuyBoxPrice']")
	public WebElement buyNewOnClicking;
			
}
