export const makeRangeRule =
  <R extends string | number, T extends string>(start: R, end: R, type: T) =>
  ([symbol]: string) => {
    return symbol >= start && symbol <= end
      ? {
          value: symbol,
          type,
          length: 1,
          status: "OK" as const,
        }
      : {
          type,
          error: "No",
          status: "ERROR" as const,
        };
  };