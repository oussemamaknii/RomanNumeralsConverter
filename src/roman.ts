/**
 * Converts an integer in the range [1, 100] to its Roman numeral representation.
 * Throws a RangeError for values outside the supported range and a TypeError for non-integers.
 */
export function convertToRoman(input: number): string {
  if (!Number.isFinite(input)) {
    throw new TypeError("Input must be a finite number");
  }
  if (!Number.isInteger(input)) {
    throw new TypeError("Input must be an integer");
  }
  if (input < 1 || input > 100) {
    throw new RangeError("Number must be between 1 and 100");
  }

  const romanNumerals: Array<{ value: number; symbol: string }> = [
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" }
  ];

  let remaining = input;
  let result = "";

  for (const { value, symbol } of romanNumerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }

  return result;
}
