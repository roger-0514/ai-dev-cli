# Repository Guidelines

## 项目结构与模块组织
当前仓库仍处于脚手架阶段，根目录只有 `package.json` 和规划文档 `NodeCLI_7天学习清单.md`。保持根目录简洁，不要把业务代码直接放在仓库顶层。

新增运行时代码请放到 `src/`，按职责拆分，例如 `src/commands/ask.js`、`src/config/`、`src/utils/`。测试代码统一放在 `tests/`，测试数据建议放在 `tests/fixtures/`。CLI 入口建议固定为 `src/index.js`。

## 构建、测试与开发命令
本项目使用 `pnpm`，版本由 `package.json` 中的 `packageManager` 指定。

- `pnpm install`：安装依赖。
- `pnpm test`：执行当前测试脚本；目前它还是占位命令，会直接报错退出。
- `pnpm exec node ./src/index.js --help`：在 CLI 入口创建后，用于本地烟雾测试。

新增功能时，请同步补充 `package.json` scripts，避免把常用流程留成手工命令。

## 代码风格与命名
项目启用了 ES Modules（`"type": "module"`）。默认使用 2 空格缩进、保留分号，并优先拆成小而单一职责的模块。

变量和函数使用 `camelCase`，类名使用 `PascalCase`，命令文件使用 kebab-case。命令命名应与规划保持一致，如 `init`、`ask`、`summarize`。

当前未配置 formatter 或 linter；如果你引入它们，请同时补充对应脚本，并在整个仓库保持一致。

## 测试要求
仓库还没有正式测试框架。提交功能时应同时补测试，而不是事后补。测试文件建议采用 `tests/<feature>.test.js` 命名，优先覆盖参数解析、配置优先级和错误处理，这些都是当前路线图中的核心能力。

## 提交与 Pull Request 规范
当前仓库还没有提交历史，因此没有可继承的 commit 规范。建议使用简短的祈使句并加类型前缀，例如 `feat: add ask command stub`、`test: cover config precedence`。

Pull Request 需要说明用户可见变化、列出新增命令或配置项；若修改 CLI 输出，附上终端示例。若有关联 issue，请一并链接；每个 PR 只处理一个清晰主题。

## 安全与配置提示
不要提交 API Key、个人配置或其他敏感信息。若后续引入 `~/.ai-dev-cli/config.json`，请在仓库中记录其字段结构，并优先通过环境变量注入密钥。
