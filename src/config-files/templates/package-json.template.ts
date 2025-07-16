const template = `
{
  "name": "<>name</>",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "tsx src/index.ts"
  }
}
`;

export default template.trim() + "\n";
