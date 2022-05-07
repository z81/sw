export const makeValueRule =
  <T extends string, U extends string>(type: U, value: T) =>
  (code: string) => {
    return code.substring(0, value.length) === value
      ? {
          value,
          type,
          length: value.length,
          status: "OK" as const,
        }
      : {
          type,
          error: "No",
          status: "ERROR" as const,
        };
  };
