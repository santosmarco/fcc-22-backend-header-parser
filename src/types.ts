export type ApiResponseSuccess = {
  ipaddress: string;
  language: string;
  software: string;
};

export type ApiResponseFail = {
  error: string;
};

export type ApiResponse = ApiResponseSuccess | ApiResponseFail;
