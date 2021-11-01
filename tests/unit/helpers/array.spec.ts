import { range } from "@/helpers/array";

describe("range helper", () => {
  test("Should generate ordinal range argument correctly", () => {
    expect(range(0)).toStrictEqual([]);
    expect(range(1)).toStrictEqual([0]);
    expect(range(5)).toStrictEqual([0, 1, 2, 3, 4]);
    expect(() => range(-1)).toThrow();
  });

  test("Should handle bias correctly", () => {
    expect(range(10, 10)).toStrictEqual([]);
    expect(range(10, 11)).toStrictEqual([10]);
    expect(range(10, 15)).toStrictEqual([10, 11, 12, 13, 14]);
    expect(range(-2, 3)).toStrictEqual([-2, -1, 0, 1, 2]);
    expect(range(-5, -3)).toStrictEqual([-5, -4]);
    expect(() => range(-5, -8)).toThrow();
  });

  test("Should handle the step correctly", () => {
    expect(range(10, 10, 3)).toStrictEqual([]);
    expect(range(10, 11, 3)).toStrictEqual([10]);
    expect(range(10, 15, 3)).toStrictEqual([10, 13]);
    expect(range(-2, 5, 3)).toStrictEqual([-2, 1, 4]);
    expect(range(1, -5, -2)).toStrictEqual([1, -1, -3]);
    expect(range(-5, -3, 1)).toStrictEqual([-5, -4]);
    expect(() => range(1, 10, 0)).toThrow();
    expect(() => range(1, 10, -2)).toThrow();
    expect(() => range(20, 10, 1)).toThrow();
  });
});
