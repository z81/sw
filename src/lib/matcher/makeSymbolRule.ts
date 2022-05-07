export const makeSymbolRule =
  <T extends string, U extends string>(type: U, symbol: T) =>
  ([codeSym]: string) => {
    return codeSym === symbol
      ? {
          value: symbol,
          type,
          length: 1,
          status: "OK" as const
        }
      : {
          type,
          error: "No",
          status: "ERROR" as const,
        };
  };
