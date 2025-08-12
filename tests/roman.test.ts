import { convertToRoman } from "../src/roman";

describe("convertToRoman", () => {
  test.each([
    [1, "I"],
    [2, "II"],
    [3, "III"],
    [4, "IV"],
    [5, "V"],
    [6, "VI"],
    [8, "VIII"],
    [9, "IX"],
    [10, "X"],
    [14, "XIV"],
    [19, "XIX"],
    [20, "XX"],
    [39, "XXXIX"],
    [40, "XL"],
    [44, "XLIV"],
    [49, "XLIX"],
    [50, "L"],
    [58, "LVIII"],
    [90, "XC"],
    [99, "XCIX"],
    [100, "C"],
  ])("%i -> %s", (num, expected) => {
    expect(convertToRoman(num)).toBe(expected);
  });

  test.each([0, -1, 101, 1000])("out of range: %p", (num) => {
    expect(() => convertToRoman(num as number)).toThrow(/between 1 and 100/);
  });

  test.each([NaN, Infinity, -Infinity, 1.1])("invalid inputs: %p", (val) => {
    expect(() => convertToRoman(val as number)).toThrow();
  });
});
