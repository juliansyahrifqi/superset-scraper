import puppeteer from "puppeteer-extra"
import { delay } from "./helper.js"
import UserPreferencesPlugin from "puppeteer-extra-plugin-user-preferences";

const userPreferenceOptions = {
  userPrefs: {
    plugins: {
      always_open_pdf_externally: true,
    },
    download: {
      open_pdf_in_system_reader: false,
      prompt_for_download: false,
      default_directory: `${process.cwd()}/result`,
    },
  },
};

export const screenshotAndDownloadCSV = async (url) => {
  try {
    console.log(url)
    const datenow = new Date();
    puppeteer.use(UserPreferencesPlugin(userPreferenceOptions))

    const browser = await puppeteer.launch({ 
      defaultViewport: null,
      headless: true,
      args: [
        "--start-maximized",
        "--disable-web-security",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      ignoreDefaultArgs: ["--disable-extensions"] 
    })

    const page = await browser.newPage()
    
    // const url = "https://superset.datatest.ch/superset/explore/?form_data_key=0QZuuEMOoK9vX_MkEYC4DYRFPz70ws1Ig-U43Ni3DFxZgp19-knB43zwKph5G9Tm&slice_id=128
    // const url = "http://localhost:8088/explore/?slice_id=1490"

    await page.goto(url, { timeout: 60000 })

    const loginBox = await page.$("#loginbox")

    if(loginBox) {
      await page.type("#username", "rifqitama")
      await page.type("#password", "rifqi12")
  
      await page.click(".btn-primary");
      await page.waitForNavigation();
    }
    
    await page.waitForSelector("#explore-container");

    await page.click(".action-button")

    await delay(2)

    await page.waitForSelector(".slice_container", {
      visible: true
    })

    const chart = await page.$(".slice_container")
    await chart.screenshot({
      path: `screenshot-${datenow}.png`
    })

    const button = await page.$('button.ant-btn[aria-label="Menu actions trigger"]');
  
  if (button) {
    await button.click();
  } else {
    console.error('Button not found');
  }


  const menuItems = await page.$$('li.ant-dropdown-menu-submenu');
  let downloadItem;
  for (const item of menuItems) {
    const text = await page.evaluate(el => el.textContent.trim(), item);
    if (text.includes('Download')) {
      downloadItem = item;
      break;
    }
  }

  if (downloadItem) {
    await downloadItem.hover();
  } else {
    console.error('Export to .CSV item not found');
  }

    await delay(3)
  
    const downloadSidebarMenus = await page.$$("li.ant-dropdown-menu-item");
    let exportToCsv;
    for (const item of downloadSidebarMenus) {
      const text = await page.evaluate(el => el.textContent.trim(), item);
      
      if (text.includes('Export to .CSV')) {
        exportToCsv = item;
        break;
      }
    }

    if (exportToCsv) {
      await exportToCsv.click();
    } else {
      console.error('Export to .CSV item not found');
    }
    
    await browser.close()
  } catch(error) {
    console.log(error)
  }
}
