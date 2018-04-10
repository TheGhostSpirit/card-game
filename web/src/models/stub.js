export class stub {
  constructor() {
    this.stub = [];
  }

  canGetFrom(index) {
    return index === this.stub.length - 1 && this.stub.length !== 0 ? true : false;
  }
}
