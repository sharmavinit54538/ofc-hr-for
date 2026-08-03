import { isRejectedWithValue, type Middleware, type SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { getApiErrorMessage, getApiErrorStatus } from "@/utils/api-error";
import { logoutAuth } from "@/features/auth/authSlice";
import { setLastApiError } from "@/features/ui/uiSlice";

/** Statuses handled by the calling screen (forms surface their own messages). */
const SILENT_STATUSES = new Set([401, 422]);

/**
 * Global API error handler: surfaces backend messages and clears the session
 * once the refresh flow has definitively failed.
 */
export const apiErrorMiddleware: Middleware = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as FetchBaseQueryError | SerializedError | undefined;
    const status = getApiErrorStatus(error);
    const message = getApiErrorMessage(error);

    api.dispatch(setLastApiError(message));

    if (status === 401) {
      const endpoint = (action.meta as { arg?: { endpointName?: string } })?.arg?.endpointName;
      if (endpoint !== "login" && endpoint !== "refresh" && endpoint !== "getMe") {
        api.dispatch(logoutAuth());
      }
    }

    if (status === null || !SILENT_STATUSES.has(status)) {
      toast.error(message);
    }
  }

  return next(action);
};
