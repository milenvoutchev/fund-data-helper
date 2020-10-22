import Fund from "../models/Fund.js";

class AllianzFundMapper {
  static createFundFromRow(data) {
    if (!data['Fondsbezeichnung'] || !data['ISIN']) {
      throw new Error("Invalid data received.")
    }
    const name = String(data.Fondsbezeichnung)
      .replace("\n", "")
      .replace("\r", "")

    return new Fund({ name: name, isin: data.ISIN })
  }
}

export default AllianzFundMapper;
