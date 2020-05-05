Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

export class MongoDate {
  constructor(date) {
    // date is object Date()
    this.date = date;
    this.year = this.date.getFullYear();
    this.month = this.date.getMonth() + 1; // start from fucking 0
    this.day = this.date.getDate();
  }

  get DateString() {
    return `${this.year.pad(4)}-${this.month.pad(2)}-${this.day.pad(2)}`;
  }

  getDate() {
    return new Date(this.DateString);
  }

  NPrevDate(n) {
    return this.date.setDate(this.date.getDate() - 1);
  }
}
