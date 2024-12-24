// eslint-disable-next-line import/no-extraneous-dependencies
import { setupWorker } from "msw/browser";

import { handlers } from "./handlers"; // 你的模擬請求處理器

export const worker = setupWorker(...handlers);
