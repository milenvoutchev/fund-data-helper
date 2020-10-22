class FundCsvMapper {
  static createFromFund(fund) {
    const csv = {
      name: fund.name,
      isin: fund.isin,
      runningCosts: fund.runningCosts
    }

    fund.performance.forEach((perf) => {
      csv[perf.year] = perf.performance;
    })

    return csv;
  }
}

export default FundCsvMapper;
