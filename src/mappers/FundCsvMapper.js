class FundCsvMapper {
  static createFromFund(fund) {
    const csv = {
      name: fund.name,
      isin: fund.isin,
      runningCosts: fund.runningCosts,
      initialFee: fund.initialFee,
      switchingFee: fund.switchingFee,
    }

    fund.performance.forEach((perf) => {
      csv[perf.year] = perf.performance;
    })

    return csv;
  }
}

export default FundCsvMapper;
