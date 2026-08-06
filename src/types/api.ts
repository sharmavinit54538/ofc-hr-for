/**
 * Shared transport contracts for the FastAPI backend.
 * Every response envelope produced by the API follows `ApiResponse<T>`.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type SortOrder = "asc" | "desc";

export interface ListParams {
  page?: number | undefined;
  page_size?: number | undefined;
  search?: string | undefined;
  sort_by?: string | undefined;
  sort_order?: SortOrder | undefined;
  status?: string | undefined;
  from_date?: string | undefined;
  to_date?: string | undefined;
  category_id?: string | undefined;
  category?: string | undefined;
  feedback_type?: string | undefined;
  filters?: Record<string, string | number | boolean | undefined> | undefined;
  [key: string]: any;
}

export interface IdParam {
  id: string;
}

export type ExportFormat = "csv" | "excel" | "pdf";

export interface ExportParams extends ListParams {
  format: ExportFormat;
}

export interface ImportResult {
  imported: number;
  failed: number;
  errors: { row: number; message: string }[];
}

export interface MutationAck {
  id: string;
  message?: string;
}

/** Flattens `ListParams` into a query string object the API understands. */
export function toQueryParams(params: ListParams = {}): Record<string, string> {
  const { filters, ...rest } = params;
  const query: Record<string, string> = {};

  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== null && value !== "") {
      query[key] = String(value);
    }
  }

  if (params.page_size && !query["limit"]) {
    query["limit"] = String(params.page_size);
  }

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        query[key] = String(value);
      }
    }
  }

  return query;
}
