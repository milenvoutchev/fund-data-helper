class Fund {
  name;
  isin;
  performance = [];
  runningCosts = 0;
  constructor ({ name, isin }) {
    this.name = name;
    this.isin = isin;
  }
}

export default Fund;
