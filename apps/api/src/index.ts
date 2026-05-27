import http from "node:http";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function loadRootEnvFile() {
  const envPath = path.resolve(process.cwd(), "../../.env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match || match[1].startsWith("#")) continue;

    const key = match[1];
    const rawValue = match[2] ?? "";
    const value = rawValue.replace(/^(['"])(.*)\1$/, "$2");
    process.env[key] ??= value;
  }
}

async function init() {
  try {
    loadRootEnvFile();

    const [{ logger }, { app: expressApplication }, { env }] = await Promise.all([
      import("@repo/logger"),
      import("./server"),
      import("./env"),
    ]);

    const server = http.createServer(expressApplication);
    const PORT: number = env.PORT ? +env.PORT : 8000;
    server.listen(PORT, () => {
      logger.info(`http server is running on PORT ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting API server", err);
    process.exit(1);
  }
}

init();
