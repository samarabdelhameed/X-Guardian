import { exec } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export const runtime = "nodejs";

export async function POST() {
  try {
    const agentDir = path.resolve(process.cwd(), "..", "agent");
    const { stdout, stderr } = await execAsync("pnpm run test:e2e", {
      cwd: agentDir,
      timeout: 45_000
    });

    return Response.json({
      ok: true,
      output: [stdout, stderr].filter(Boolean).join("\n").trim()
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Agent E2E check failed";
    return Response.json(
      {
        ok: false,
        error: message
      },
      { status: 500 }
    );
  }
}
