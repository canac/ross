import { HTTPException } from "@hono/hono/http-exception";
import { isErrorStatus, STATUS_TEXT } from "@std/http/status";

export function validateResponse(res: Response): void {
  if (isErrorStatus(res.status)) {
    throw new HTTPException(res.status, { message: STATUS_TEXT[res.status] });
  }
}
