const fs = require('fs');
const PDFParser = require("pdf2json");

module.exports = extractCheckData;

function extractCheckData (pdfLocation, outputLocation) {
  if (!pdfLocation) {
    return Promise.resolve({
      success: false,
      msg: 'No source file location provided.',
      deposits: []
    });
  }

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
    
      // Estable store for extracted checks
      const checks = [];
    
      // Combine texts from multiple pages
      const texts = pdfData.formImage.Pages.reduce((acc, page) => {
        return acc.concat(page.Texts);
      }, []);

      let posted = null;
    
      // Extract check data
      const modes = {
        'Check #': 'num',
        'Check amount': 'amt',
        'Account #': 'acct',
        'Routing #': 'rout',
        'Post date': 'posted'
      }
      let mode = null;
      texts.forEach(text => {
        text = decodeURIComponent(text.R[0].T);
    
        // Detect check
        if (text === 'Check') {
          checks.push({
            posted
          });
        }
    
        // Handle mode
        if (mode) {
          if (mode === 'posted') {
            const datetime = new Date(text);
            if (datetime.toString() === "Invalid Date") {
              posted = text;
            } else {
              posted = (new Date(text)).toISOString().slice(0, 10);
            }
          } else {
            checks[checks.length - 1][mode] = text;
          }
          return mode = null;
        }
    
        // Detect mode
        if (modes[text]) {
          mode = modes[text]
        }
    
      })
  
      if (outputLocation) {
        try {
          fs.writeFileSync(outputLocation, JSON.stringify(checks, null, 2));
  
        } catch (e) {
          return reject({
            success: false,
            msg: `Save error: ${e}`,
            deposits: []          
          });
        }
      }
  
      resolve({
        success: true,
        msg: 'Extraction complete.',
        deposits: checks
      })
  
    });
    
    pdfParser.loadPDF(pdfLocation);

  });

}
