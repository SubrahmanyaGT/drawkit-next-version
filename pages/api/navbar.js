export default async function handler(req, res) {

    const cheerio = require("cheerio");
    const axios = require("axios");
  
    const webUrl = "https://drawkit-v2.webflow.io/";
    const response = await axios(webUrl);
    const html = response.data;
    const $ = cheerio.load(html);
  
    const supportScripts = Object.keys($(`script`))
      .map((key) => {
        if ($(`script`)[key].attribs) return $(`script`)[key].attribs.src;
      })
      .filter((src) => {
        if (src) return src;
      })
    //   .map((m) => `<Script type="text/javascript" src="${m}"></Script>`)
    //   .join("")
    //   .toString();
   
  
    
    res.status(200).json({ supportScripts: supportScripts })
  }
  