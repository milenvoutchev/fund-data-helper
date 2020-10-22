class FundPerformanceService {
  performanceProvider;
  constructor({ performanceProvider}) {
    this.performanceProvider = performanceProvider;
  }

  async getPerformance(fund) {
    return await this.performanceProvider.fetchPerformance(fund);
  }

  async getRunningCosts(fund) {
    return await this.performanceProvider.fetchRunningCosts(fund);
  }
}

export default FundPerformanceService;
