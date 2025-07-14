# TS Scaffold
A CLI scaffold that allows you to quickly build your own TypeScript project with many usefull tools.

(Only Node.js supported for now. Welcome contribute!)

# Why TS Scaffold
手动搭一个typescript项目非常费劲，目前除了一些自己维护了一个脚手架CLI的大型框架（比如Next.JS）之外，如果我想搭一个纯TS的模板，居然没有好用的脚手架？！不敢相信！于是就有了 ts-scaf。

我们支持你直接创建我们推荐的项目构造，我们也支持你通过 cli 参数指定项目构造以及安装的包，或者通过 config 文件详细指定（WIP）。

总的来说，开箱即用！并且高度可定制。

# Quick Start
```sh
npx ts-scaf --name my-project
```

# Use as a module (WIP)
You can import `ts-scaf` just like any other module, which helps you build your own template project CLI.
```sh
# WIP
```

# TS Scaffold 项目的终点
一个可复用，模块化的 TypeScript 项目脚手架。你可以一行命令来创建我们提供的各种模板，你也可以通过保存 config 文件传给 ts-scaf 创建你自己的模板！或者上传 config 文件到 gits 或其他地方，然后在各种环境下使用 ts-scaf 来一键创建模板项目！

我们的最终目标是，各个大框架可以不再自己维护自己的脚手架命令行，维护自己的脚手架命令行的成本并不低廉（例如create-react-app目前已停止维护），只需要维护自己的 config 文件，然后把文件传给 ts-scaf 就能自动化帮你做一切事情。

多平台目标是支持包括 Node.js, deno, bun在内的主流javascript runtime以及windows, unix-like在内的各种OS（目前只支持Node.js + unix-like，欢迎贡献代码！）。

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
- [ ] v1.0.0 Release 🎉