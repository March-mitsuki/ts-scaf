# TS Scaffold
A CLI scaffold that allows you to quickly build your own TypeScript project with many usefull tools.

(Only Node.js supported for now. Welcome contribute!)

# Why TS Scaffold
Manually setting up a TypeScript project can be a real hassle. Aside from a few major frameworks that maintain their own CLI scaffolds (like Next.js), it's hard to believe there's no good scaffolding tool for creating a clean, pure TypeScript template out of the box!

That’s exactly why ts-scaf was born.

With ts-scaf, you can:
- Instantly create a project using our recommended setup
- (WIP) Customize the structure and dependencies via CLI options
- (WIP) Use a config file to define your setup in detail

In short: zero config to get started, and highly customizable when you need it.


# Quick Start
```sh
npx ts-scaf --name my-project

# or
pnpm dlx ts-scaf --name my-project

# or
yarn dlx ts-scaf --name my-projec
```

# Use as a module (WIP)
You can import `ts-scaf` just like any other module, which helps you build your own template project CLI.
```sh
# WIP
```

# The Vision of the TS Scaffold Project
A reusable, modular TypeScript project scaffold.

With a single command, you can create projects from a variety of templates we provide. You can also save a config file and pass it to `ts-scaf` to generate your own custom project templates! Alternatively, upload the config file to Gist or any other platform, and use `ts-scaf` across different environments to instantly scaffold projects with one command.

Our ultimate goal is to free major frameworks from the burden of maintaining their own CLI scaffolding tools. Maintaining a custom CLI (like create-react-app, which is no longer maintained) comes with significant overhead. Instead, frameworks only need to maintain a simple config file—`ts-scaf` will handle everything else automatically.

Cross-platform support is also a key goal: `ts-scaf` aims to run on all major JavaScript runtimes including Node.js, Deno, and Bun, as well as across both Windows and Unix-like systems. (Only Node.js + Unix-like is supported for now, welcome contribute!)

# The Not-So-Perfect Part
The goal of this project is to generate a repository with 100% TypeScript code. However, if you want the Prettier configuration to work properly with the VSCode plugin, you’re limited to using JSON, YAML, or JS files.

TypeScript files won’t work because the VSCode plugin doesn't support `--experimental-strip-types` when reading config files.

We decided against using JSON or YAML since they lack proper type support for configuration. In the end, we chose to use a JS file. While this slightly compromises the purity of having a fully TypeScript codebase, it offers a much better developer experience.

# Road Map

- [x] v0.1.3 <- NOW
  - [x] Create a typescript project with recommanded devDependencies
- [ ] v0.2.0
  - [ ] Add test suit to recommanded installation. (use vitest)
- [ ] v0.3.0
  - [ ] Allow user selection with cmd line
- [ ] v0.4.0
  - [ ] Add config file feature for advance usage
- [ ] v0.5.0
  - [ ] Add deno support
  - [ ] Add bun support
  - [ ] Add windows support
- [ ] v1.0.0 Release 🎉