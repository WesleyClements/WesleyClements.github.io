export const capitalize = (str: string): string =>
  str.charAt(0).toLocaleLowerCase() + str.slice(1);

export const fileName = (
  strings: TemplateStringsArray,
  ...args: unknown[]
): string => {
  if (strings.length === 1) {
    return strings[0];
  }
  let result = "";
  for (let i = 0; i < args.length; i++) {
    result += strings[i];
    const arg = args[i];
    if (typeof arg === "string") {
      result += arg.toLocaleLowerCase().replaceAll(/\s+/g, "-");
    } else {
      console.log(typeof arg, arg);
    }
  }
  result += strings[strings.length - 1];
  return result;
};
