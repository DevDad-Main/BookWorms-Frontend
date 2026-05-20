export interface ExceptionResponse {
  businessErrorCode?: number;
  businessErrorDescription?: string;
  error?: string;
  message?: string;
  validationErrors?: string[];
}
