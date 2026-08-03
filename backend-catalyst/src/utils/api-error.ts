import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

type UnknownError = FetchBaseQueryError | SerializedError | Error | { message?: string } | unknown;

interface FastApiValidationItem {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
}

interface FastApiErrorBody {
  detail?: string | FastApiValidationItem[];
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

const STATUS_FALLBACKS: Record<number, string> = {
  400: "The request could not be processed.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This action conflicts with the current state of the record.",
  422: "Some of the submitted values are invalid.",
  429: "Too many requests. Please slow down and try again.",
  500: "The server encountered an unexpected error.",
  503: "The service is temporarily unavailable. Please try again shortly.",
};

export function isFetchBaseQueryError(error: UnknownError): error is FetchBaseQueryError {
  return Boolean(error) && typeof error === "object" && "status" in (error as object);
}

export function getApiErrorStatus(error: UnknownError): number | null {
  if (isFetchBaseQueryError(error) && typeof error.status === "number") {
    return error.status;
  }
  return null;
}

/** Extracts the backend-provided message. Never invents a message of its own. */
export function getApiErrorMessage(error: UnknownError, fallback = "Request failed."): string {
  if (!error) return fallback;

  if (isFetchBaseQueryError(error)) {
    if (error.status === "FETCH_ERROR") {
      return "Unable to reach the server. Check your connection and try again.";
    }
    if (error.status === "TIMEOUT_ERROR") {
      return "The server took too long to respond.";
    }
    if (error.status === "PARSING_ERROR") {
      return "The server returned an unreadable response.";
    }

    const body = error.data as FastApiErrorBody | string | undefined;

    if (typeof body === "string" && body.trim()) {
      return body;
    }

    if (body && typeof body === "object") {
      const { detail, message, error: errorText, errors } = body;

      if (typeof detail === "string" && detail.trim()) return detail;

      if (Array.isArray(detail) && detail.length > 0) {
        return detail
          .map((item) => {
            const field = item.loc?.filter((part) => part !== "body").join(".");
            return field ? `${field}: ${item.msg ?? "invalid value"}` : (item.msg ?? "Invalid value");
          })
          .join(" · ");
      }

      if (typeof message === "string" && message.trim()) return message;
      if (typeof errorText === "string" && errorText.trim()) return errorText;

      if (errors && typeof errors === "object") {
        const flattened = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join(" · ");
        if (flattened) return flattened;
      }
    }

    if (typeof error.status === "number" && STATUS_FALLBACKS[error.status]) {
      return STATUS_FALLBACKS[error.status] as string;
    }

    return fallback;
  }

  if (typeof error === "object" && error !== null && "message" in error && typeof (error as { message?: unknown }).message === "string") {
    return (error as { message: string }).message;
  }

  return fallback;
}

/** Maps FastAPI 422 payloads onto react-hook-form field errors. */
export function getFieldErrors(error: UnknownError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (!isFetchBaseQueryError(error)) return fieldErrors;

  const body = error.data as FastApiErrorBody | undefined;
  if (!body || typeof body !== "object") return fieldErrors;

  if (Array.isArray(body.detail)) {
    for (const item of body.detail) {
      const field = item.loc?.filter((part) => part !== "body").join(".");
      if (field) fieldErrors[field] = item.msg ?? "Invalid value";
    }
  }

  if (body.errors) {
    for (const [field, messages] of Object.entries(body.errors)) {
      fieldErrors[field] = messages.join(", ");
    }
  }

  return fieldErrors;
}
