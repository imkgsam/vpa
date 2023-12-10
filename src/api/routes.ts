import { http } from "@/utils/http";
import type { statusCodeType } from "@/utils/http/types";

type Result = {
  success: boolean;
  statusCode: statusCodeType;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", "/get-async-routes");
};
