import { execSync } from "child_process";

const PORTS = [4000, 5174, 5173, 4173];

console.log(`Checking and freeing ports: ${PORTS.join(", ")}...`);

for (const port of PORTS) {
  try {
    if (process.platform === "win32") {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] });
      const lines = output.split("\n");
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5 && parts[1].includes(`:${port}`)) {
          const pid = parts[parts.length - 1];
          if (pid && pid !== "0" && pid !== String(process.pid)) {
            pids.add(pid);
          }
        }
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          console.log(`[KILLED] Stale process on port ${port} (PID ${pid})`);
        } catch (_) {}
      }
    } else {
      execSync(`lsof -t -i:${port} | xargs kill -9`, { stdio: "ignore" });
      console.log(`[KILLED] Stale process on port ${port}`);
    }
  } catch (_e) {
    // Port not in use, which is fine
  }
}

console.log("[OK] Ports checked.");
