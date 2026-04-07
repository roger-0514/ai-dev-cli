/** 最低层默认值（配置文件、环境变量、CLI 都未覆盖时使用） */
export const DEFAULTS = {
  provider: "gemini",
  apiKey:"",
  retries: 1,
  timeout: 30000,
  baseUrl: "",
  model: "gemini-3-flash-preview",
  temperature: 0.2,
  json: false,
};
