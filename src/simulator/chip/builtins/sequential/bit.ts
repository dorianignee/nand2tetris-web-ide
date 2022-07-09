import { ClockedChip, HIGH, LOW, Voltage } from "../../chip";

export class Bit extends ClockedChip {
  bit: Voltage = LOW;

  constructor(name?: string) {
    super(["in", "load"], ["out"], name);
  }

  override tick() {
    if (this.in("load").voltage() === HIGH) {
      this.bit = this.in().voltage();
    }
  }

  override tock() {
    this.out().pull(this.bit ?? 0);
  }
}

export class Register extends ClockedChip {
  bits: number = 0x00;

  constructor(name?: string) {
    super(["in[16]", "load"], ["out[16]"], name);
  }

  override tick() {
    if (this.in("load").voltage() === HIGH) {
      this.bits = this.in().busVoltage & 0xffff;
    }
  }

  override tock() {
    this.out().busVoltage = this.bits & 0xffff;
  }
}

export class PC extends ClockedChip {
  bits: number = 0x00;

  constructor(name?: string) {
    super(["in[16]", "load", "inc", "reset"], ["out[16]"], name);
  }

  override tick() {
    if (this.in("reset").voltage() === HIGH) {
      this.bits = 0;
    } else if (this.in("load").voltage() === HIGH) {
      this.bits = this.in().busVoltage & 0xffff;
    } else if (this.in("inc").voltage() === HIGH) {
      this.bits += 1;
    }
  }

  override tock() {
    this.out().busVoltage = this.bits & 0xffff;
  }
}