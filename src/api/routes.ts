import { http } from "@/utils/http";
import type { statusCodeType } from "@/utils/http/types";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  statusCode: statusCodeType;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", "/get-async-routes");
};

export const getAllAsyncRoutes = () => {
  return http.request<Result>("get", baseUrlApi("test/route/all"));
};
