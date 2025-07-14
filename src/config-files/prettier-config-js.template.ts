const template = `
/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: "all",
};

export default config;
`;
export default template.trim() + "\n";
