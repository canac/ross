import { isErrorStatus, STATUS_TEXT } from "@std/http/status";
import { HTTPException } from "hono/http-exception";

export function validateResponse(res: Response): void {
  if (isErrorStatus(res.status)) {
    throw new HTTPException(res.status, { message: STATUS_TEXT[res.status] });
  }
}
