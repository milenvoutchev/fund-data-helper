import fetch from "node-fetch";
import DomParser from "dom-parser";

/**
 * @type {{isin: {...}}}
 */
let dataCache = {
  'isin': {}
};

class OnvistaProvider {
  async fetchPerformance(fund) {
    const data = await this._getData(fund.isin);

    return OnvistaProvider._getYearsWithPerformance(data);
  }

  async fetchRunningCosts(fund) {
    const data = await this._getData(fund.isin);

    const allInFee = data.props.pageProps.data.snapshot.fundsBaseData.allInFee || data.props.pageProps.data.snapshot.fundsBaseData.ongoingCharges;

    return OnvistaProvider._normalizePercentage(allInFee);
  }

  async fetchInitialFee(fund) {
    const data = await this._getData(fund.isin);

    const initialFee = data.props.pageProps.data.snapshot.fundsBaseData.maxPctInitialFee;

    return OnvistaProvider._normalizePercentage(initialFee);
  }

  async fetchSwitchingFee(fund) {
    const data = await this._getData(fund.isin);

    const switchingFee = data.props.pageProps.data.snapshot.fundsBaseData.switchingFee || 0;
    const maxPctRedemptionFee = data.props.pageProps.data.snapshot.fundsBaseData.maxPctRedemptionFee || 0;

    return OnvistaProvider._normalizePercentage((switchingFee + maxPctRedemptionFee));
  }

  async _getData(isin) {
    if (dataCache[isin]) {
      return dataCache[isin];
    }
    const response = await fetch(`https://www.onvista.de/fonds/ALLIANZ-GIF-ALLIANZ-ADVANCED-FIXED-INCOME-SHORT-DURATION-IT-EUR-ACC-Fonds-${isin}`)

    const html = await response.text();

    const parser = new DomParser();
    const dom = parser.parseFromString(html);

    const json = dom.getElementById("__NEXT_DATA__").innerHTML;
    const data = JSON.parse(json);

    dataCache[isin] = data;

    return data;
  }

  static _getYearsWithPerformance(data) {
    const list = data.props.pageProps.data.snapshot.fundsPerformanceList.list || [];

    return list.reduce((yearsWithPerformance, element, index) => {

      const performance = element.performanceTimeSpanPct ? OnvistaProvider._normalizePercentage(element.performanceTimeSpanPct) : null;
      const block = {
          "year": `${element.timeSpan} (${element.nameTimeSpan})`,
          "performance": performance,
        }
        yearsWithPerformance.push(block);

        return yearsWithPerformance;
    }, []);
  }

  static _normalizePercentage(percent) {
    if (typeof percent !== "number") {
      return percent;
    }

    return percent / 100;
  }
}

export default OnvistaProvider;
