/** 最低层默认值（配置文件、环境变量、CLI 都未覆盖时使用） */
export const DEFAULTS = {
  provider: "openai",
  apiKey: "",
  retries:1,
  timeout:30000,
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-4.1",
  temperature: 0.2,
  json: false,
};
