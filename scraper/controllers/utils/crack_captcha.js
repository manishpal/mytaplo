
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

async function screenshotDOMElement(page, selector, padding = 0, file="temp/element.png") {
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector);
    const {x, y, width, height} = element.getBoundingClientRect();
    return {left: x, top: y, width, height, id: element.id};
  }, selector);

  return await page.screenshot({
    path: file,
    clip: {
      x: rect.left - padding,
      y: rect.top - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    }
  });
}


async function googleBot(page, screenshotFile='temp/element.png') {
  console.log("Using google vision");
  await page.goto('https://www.gstatic.com/cloud-site-ux/vision.min.html');
  let input = await page.$('input[type="file"]');
  await input.uploadFile(screenshotFile);
  await page.waitFor(4000);
  let jsonDiv = await page.$('vs-json[id="json"]');
  let json = await page.evaluate(el => el.innerText, jsonDiv);
  let data = JSON.parse(json);
  console.log("json", data.textAnnotations[1].description);
  return data.textAnnotations[1].description;
}


async function getCapText(page, browser, domSelector, file){
  await screenshotDOMElement(page, domSelector, 2, file);
  let capText = await googleBot(await browser.newPage(), file);
  return capText;
}

module.exports = getCapText;
