import fs from "fs";
import stringify from "csv-stringify";
import parse from "csv-parse/lib/sync.js";
import AllianzEtfProcessor from "./src/mappers/AllianzFundMapper.js";
import FundCsvMapper from "./src/mappers/FundCsvMapper.js";
import FundPerformanceService from "./src/services/FundPerformanceService.js";
import OnvistaProvider from "./src/dataProviders/OnvistaProvider.js";


const inFile = './data/export-isin.csv'
const outFile = './data/output.csv'
const onvistaProvider = new OnvistaProvider();
const fundPerformanceService = new FundPerformanceService({performanceProvider: onvistaProvider});

(async function () {
  const fileContent = fs.readFileSync(inFile);
  const records = parse(fileContent, {columns: true});
  const fundsForCsv = await Promise.all(records.map(async (record) => {
    const fund = AllianzEtfProcessor.createFundFromRow(record);
    fund.performance = await fundPerformanceService.getPerformance(fund);
    fund.runningCosts = await fundPerformanceService.getRunningCosts(fund);

    return FundCsvMapper.createFromFund(fund);
  }));

  stringify(fundsForCsv,{
    header: true,
    // columns: ['name', 'isin', 'runningCosts', '2020', '2019']
  }, (err, output) => {
    fs.writeFileSync(outFile, output);
  });
})();
