class FundPerformanceService {
  performanceProvider;
  fund;
  constructor({ performanceProvider, fund}) {
    this.performanceProvider = performanceProvider;
    this.fund = fund;
  }

  async getPerformance() {
    return await this.performanceProvider.fetchPerformance(this.fund);
  }

  async getRunningCosts() {
    return await this.performanceProvider.fetchRunningCosts(this.fund);
  }

  async getInitialFee() {
    return await this.performanceProvider.fetchInitialFee(this.fund);
  }

  async getSwitchingFee() {
    return await this.performanceProvider.fetchSwitchingFee(this.fund);
  }
}

export default FundPerformanceService;
