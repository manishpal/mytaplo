const puppeteer = require('puppeteer');
var Tesseract = require('tesseract.js')
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

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://dgftebrc.nic.in:8100/BRCQueryTrade/brcIssuedTrade.jsp');
  //await page.screenshot({path: 'example.png'});
  let count = 0;
  let inputIEC = await page.$('input[name="iec"]');
 // console.log("inputIEC initial is", inputIEC);
  while(inputIEC){
    await page.type('input[name="iec"]', '0388147831');
    const inputValue = await page.$eval('input[name="iec"]', el => el.value);
    //console.log('input value set is', inputValue);
    const parent = await page.$eval('body > form > div > center > table > tbody > tr:nth-child(6) > td:nth-child(3) > img', el => el.src);
    //console.log('captch src  is', parent);
    let result = await ocr(Buffer.from(parent.replace("data:image/jpg;base64,", ""), 'base64'));
    let captext = result.text.replace("\n\n", "");
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
  await browser.close();
  process.exit(0);
})();

