import fetch from "node-fetch";
import DomParser from "dom-parser";

/**
 * @type {{isin: {...}}}
 */
let domCache = {
  'isin': {}
};

class OnvistaProvider {
  async fetchPerformance(fund) {
    const dom = await this._getDom(fund.isin);

    return OnvistaProvider._getYearsWithPerformance(dom);
  }

  async fetchRunningCosts(fund) {
    const dom = await this._getDom(fund.isin);

    const fees = /Laufende Kosten(.|\n)+?([\d,]+)%<\/td>/.exec(dom.rawHTML);

    if (!fees) {
      return null;
    }

    return OnvistaProvider._normalizePercentage(fees[2]);
  }

  async _getDom(isin) {
    if (domCache[isin]) {
      return domCache[isin];
    }
    const response = await fetch(`https://www.onvista.de/fonds/ALLIANZ-GIF-ALLIANZ-ADVANCED-FIXED-INCOME-SHORT-DURATION-IT-EUR-ACC-Fonds-${isin}`)

    const html = await response.text();

    const parser = new DomParser();
    const dom = parser.parseFromString(html);

    domCache[isin] = dom;

    return dom;
  }

  static _getYearsWithPerformance(dom) {
    const elements = dom.getElementById("table-performance-per-year").getElementsByTagName("thead")[0].getElementsByTagName("th");
    return elements.reduce((yearsWithPerformance, element, index) => {
      if (element.innerHTML.length) {
        const relatedElement = dom.getElementById("table-performance-per-year").getElementsByTagName("tbody")[0].getElementsByTagName("td")[index];
        const performance = OnvistaProvider._normalizePercentage(relatedElement.innerHTML);
        const block = {
          "year": element.innerHTML,
          "performance": !isNaN(performance) ? performance : null,
        }
        yearsWithPerformance.push(block);
      }
      return yearsWithPerformance;
    }, []);
  }

  static _normalizePercentage(text) {
    const percentageStr = /[-\d,.]+/.exec(text)[0];

    return parseFloat(percentageStr.replace(",","."));
  }
}

export default OnvistaProvider;
