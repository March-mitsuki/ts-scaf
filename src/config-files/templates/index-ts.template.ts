const template = `
export function add(a: number, b: number) {
  return a + b;
}
console.log("Running a template TypeScript file:");
console.log("The sum of 5 and 3 is:", add(5, 3));
console.log("Project <>name</> running normally.");
`;

export default template.trim() + "\n";
