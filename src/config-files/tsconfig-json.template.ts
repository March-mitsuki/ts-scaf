const tmplate = `
{
  "compilerOptions": {
    "target": "es2024",
    "module": "commonjs",
    "lib": ["ES2024"],
    "noEmit": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "strict": true,
    "noImplicitAny": false,
    "noUncheckedIndexedAccess": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": false,
    "skipDefaultLibCheck": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["node", "./global.d.ts"]
  },
  "exclude": ["node_modules"],
  "include": ["src/**/*.ts", "tests/**/*.ts", "eslint.config.ts"]
}
`;
export default tmplate.trim() + "\n";
