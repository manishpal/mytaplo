const puppeteer = require('puppeteer');
const axios = require('axios');
const https = require('https');
const cheerio = require('cheerio')

//var Tesseract = require('tesseract.js')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
async function fetchIECDetails(iecInput, companyName){
  let queryString = "iec="+iecInput+"&name="+encodeURIComponent(companyName);
  console.log("queryString is ", queryString);
  return axios('http://dgft.delhi.nic.in:8100/dgft/IecPrint', 
                { method: 'POST', data : queryString, 
                  headers :{'Content-Type': 'application/x-www-form-urlencoded'} } )
                  .then(response => { 
                              
                      //console.log("got response", response.data);
                      const $ = cheerio.load(response.data.replace("<BR>", "\n"), { normalizeWhitespace: true});
                      let table = $('table');
                      if(table.length === 0){
                        //We got error 
                        return [$('body').text(), undefined];
                      }
                      var dataArray = table.first().text().split("\n");
                      var data = {};
                      let key, val;
                      for(var i=0;i<dataArray.length;i++){
                        let dataRow = dataArray[i].split(":");
                        if(dataRow.length == 2){
                          data[dataRow[0].trim()] = dataRow[1].trim().replace(/\s+/g,' ');  
                        }                        
                      }
                      if(table.length > 1){
                        //Second table is Directors information
                        var dirArray = $(table.get(1)).find('tr').map(function(index, elem){ return $(elem).text().trim().replace(/\s{2,}/g, '\n');});
                        let dirDetails = dirArray.map(function(elem){
                          let dirData = {};
                          let infoArr = this.replace(/\d\./,"").split("\n");
                          dirData['name'] = infoArr[0];
                          dirData['fatherName'] = infoArr[1];
                          let remainingString = infoArr.slice(2, infoArr.length).join("\n");
                          let splitter = "Phone/Email:";
                          let splitIndex = remainingString.indexOf(splitter);
                          if(splitIndex != -1){
                            dirData['address'] = remainingString.substr(0, splitIndex);
                            dirData['phone/email'] = remainingString.substr(splitIndex+splitter.length);   
                          }else{
                            //Oops phone/email is not there. Safety here.
                            dirData['extraInfo'] = remainingString;
                          }
                          return dirData;
                        })
                        data['directors'] = dirDetails.get();
                      }

                      if(table.length > 2){
                        //Third table is Branch offices
                        var branchArray = $(table.get(2)).find('tr').map(function(index, elem){ return $(elem).text().trim().replace(/\s{2,}/g, '\n');});
                        let branchDetails = branchArray.map(function(elem){
                          let branchData = {};
                          branchData['branch'] = this.replace(/\d\./,"");
                          return branchData;
                        });
                        data['branches'] = branchDetails.get();
                      }

                      console.log("got table", data);

                      return [null, data];

                  }).catch(err => {
                    console.log("got in error", err);
                    return [err.response, null];
                  });
}


let getIECData =  async (iec, companyName) => {
  return await fetchIECDetails(iec, companyName);  
};

module.exports = getIECData;

