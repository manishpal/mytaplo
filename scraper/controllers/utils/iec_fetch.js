const puppeteer = require('puppeteer');
const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio')

//var Tesseract = require('tesseract.js')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let ocr = function(data) {
  return Tesseract.recognize(data, {langPath :  './'})
  .progress(function  (p) { console.log('progress', p)  })
  .catch(err => {
    console.error(err);
  })
  .then(function (result) {
    console.log(result.text);
  })
  //.finally(resultOrError => console.log(resultOrError));  
};

async function screenshotDOMElement(page, selector, padding = 0) {
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector);
    const {x, y, width, height} = element.getBoundingClientRect();
    return {left: x, top: y, width, height, id: element.id};
  }, selector);

  return await page.screenshot({
    path: 'temp/element.png',
    clip: {
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    }
  });
}


async function googleBot(page) {
  console.log("Using google vision");
  await page.goto('https://www.gstatic.com/cloud-site-ux/vision.min.html');
  let input = await page.$('input[type="file"]');
  await input.uploadFile('temp/element.png');
  await page.waitFor(4000);
  let jsonDiv = await page.$('vs-json[id="json"]');
  let json = await page.evaluate(el => el.innerText, jsonDiv);
  let data = JSON.parse(json);
  console.log("json", data.textAnnotations[1].description);
  return data.textAnnotations[1].description;
}

function getPortName(options, code){
  let portNames = options.split("\n");
  let ports = portNames.filter(function (elem){
    return elem.indexOf(code) != -1;
  });
  if(ports[0])
    return ports[0].trim();
  return undefined;
}


async function fetchCookie(browser, data) {
  const page = await browser.newPage();
  await page.goto('https://enquiry.icegate.gov.in/enquiryatices/sbTrack');
  page.on('dialog', async dialog => {
    console.log(dialog.message());
    await dialog.dismiss();
  });

  console.log("loaded icegate site");
  let locationOptions = undefined;
  
  loggedIn = false;
  let portCode = data['SHB Port'];
  let shippingBill = data['SHB No'];
  let shippingBillDate = data['SHB Date'].split(".").reverse().join("/");
  let count = 0;
  while(!loggedIn && count < 20){
    //console.log("Trying logging in", capText);
    await screenshotDOMElement(page, '#capimg', 2);
    let capText = await googleBot(await browser.newPage());

    await page.type('input[name="SB_NO"]', shippingBill);
    let optionsElem = await page.evaluate((date) => {
      document.querySelector('input[name="SB_DT"]').value = date;
      var elem = document.getElementById('location');
      return elem.textContent;
    }, shippingBillDate);
    
    let portName = getPortName(optionsElem, portCode);
    locationOptions = optionsElem;
    await page.evaluate((portName) => {
      let selectElem = document.getElementById('location');
      selectElem.value = portName;
      var options = selectElem.getElementsByTagName('option');
      for(var m=0;m<options.length;m++){
        if(options[m].value == portName)
          options[m].selected = true;
      }
    }, portName);
    await page.evaluate(() => {
      document.getElementById('captchaResp').value = '';
    });

    await page.type('input[name="captchaResp"', capText);
    console.log("Got option to select as", portName, "& captext", capText);
    
   // await page.screenshot({path: 'temp/picture.png'});
    
    await page.click('#SubB');    
    await page.waitFor(2*1000);

   // await page.screenshot({path: 'resultingpage.png'});
    let captcha =  await page.$('#capimg');
    loggedIn = (captcha === undefined || captcha === null);
    //console.log("loggedIn is ", captcha);
    count++;
  }

  if(count < 20){
     const cookies = await page.cookies();
     let cookieString = cookies.map(function(cook){return cook.name+"="+cook.value;}).join(";")
     return [cookieString, locationOptions];
  }
  return [undefined, locationOptions];

}

async function fetchShippingData(data, cookie){
  const agent = new https.Agent({  
    rejectUnauthorized: false
  });
  let shippingBillDate = data['SHB Date'].split(".").reverse().join("/");
  let queryString = "SB_NO="+data['SHB No']+"&SB_DT="+encodeURIComponent(shippingBillDate)+"&sbTrack_location=" + encodeURIComponent(data['PortName']);
  //console.log("queryString is", queryString);
  return axios('https://enquiry.icegate.gov.in/enquiryatices/SB_IcesDetails_action', 
                              { method: 'POST', httpsAgent: agent, data : queryString, 
                                headers :{'Content-Type': 'application/x-www-form-urlencoded', 'Cookie' : cookie} } )
                              .then(response => { 
                              
                                //console.log("got response", response.data);
                                const $ = cheerio.load(response.data);
                                let headerData = $('.thText th').map(function(i, el){return $(this).text();}).get();
                                let rowData = $('.tdText td').map(function(i, el){return $(this).text();}).get();
                                //console.log("got data", headerData, rowData);
                                for(var m=0;m<headerData.length;m++){
                                  data[headerData[m]] = rowData[m];
                                }
                                return data;

                              });
}

async function fetchIECDetails(browser, iecInput){
  const page = await browser.newPage();
  await page.goto('http://dgftebrc.nic.in:8100/BRCQueryTrade/brcIssuedTrade.jsp');
  //await page.screenshot({path: 'example.png'});
  let count = 0;
  let inputIEC = await page.$('input[name="iec"]');
 // console.log("inputIEC initial is", inputIEC);
  while(inputIEC){
    //await page.type('input[name="iec"]', '0388147831');
    await page.type('input[name="iec"]',  iecInput);
    const inputValue = await page.$eval('input[name="iec"]', el => el.value);
    //console.log('input value set is', inputValue);
    //const parent = await page.$eval('body > form > div > center > table > tbody > tr:nth-child(6) > td:nth-child(3) > img', el => el.src);
    //console.log('captch src  is', parent);
    await screenshotDOMElement(page, 'body > form > div > center > table > tbody > tr:nth-child(6) > td:nth-child(3) > img', 2);
    let captext = await googleBot(await browser.newPage());

    //let result = await ocr(Buffer.from(parent.replace("data:image/jpg;base64,", ""), 'base64'));
    //let captext = result.text.replace("\n\n", "");
    await page.type('input[name="captext"]', captext);
    const [response] = await Promise.all([
      page.waitForNavigation(),
      page.click('input[name="B1"]')
    ]);
    await page.waitFor(2*1000);
    inputIEC = await page.$('input[name="iec"]');
    if(inputIEC)
      console.log("Got input IEC", await inputIEC.jsonValue());
    count++;
  }

  console.log("Tried captcha for %s times", count);
  let trs = await page.$$('body > div:nth-child(7) > center > table > tbody > tr', rows => {
     console.log("rows.length", rows);
     return rows;
  });

  var data = [];
  const headerHtml = await page.evaluate(el => el.innerText, trs[0]);
  let headerRow = headerHtml.split('\t');
  for(var i=1;i<trs.length;i++){
    const innerhtml = await page.evaluate(el => el.innerText, trs[i])
    let rowData = innerhtml.split('\t');
    let object = {};
    for(var j=0;j<rowData.length;j++)
      object[headerRow[j].trim()] = rowData[j].trim();
    data.push(JSON.parse(JSON.stringify(object)));
  } 
  console.log("got response", data);
  return data;
}


let getIECData =  async (iec, rowCount) => {
  let finalData = "";
  const browser = await puppeteer.launch();
  let brcData = await fetchIECDetails(browser, iec);
  let limit = rowCount;
  iBrcData = brcData.slice(0, limit);

  let inputData = { 'SHB No': '2702736',
                    'SHB Port': 'INDER6',
                    'SHB Date': '08.12.2016' }
  let [cookie, locationOptions] = await fetchCookie(browser, inputData);
  console.log("locationOptions", locationOptions);
  var cleanedBrcData = [];
  for(var t=0;t<iBrcData.length;t++){
    let portName = getPortName(locationOptions, iBrcData[t]['SHB Port'].trim());
    if(portName){
      iBrcData[t]['PortName'] = portName;
      cleanedBrcData.push(iBrcData[t]);
    }else{
      console.log("Skipped one row", iBrcData);
    }
  }

  console.log("Got cookie data", cookie);
  if(cookie) {
    //If we are able to authenticate successfully, lets fetch shipping data
    let reqPromises = cleanedBrcData.map(function(it) { return fetchShippingData(it, cookie); });
    let shippingData = await Promise.all(reqPromises);
    console.log("shippingData", shippingData);
    finalData = shippingData;
  }

  //console.log("Got data", data);
  await browser.close();
  return finalData;
};

module.exports = getIECData;

