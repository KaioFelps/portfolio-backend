declare global {
  interface BigInt {
    toJSON(): string | number;
  }
}

export default {};
