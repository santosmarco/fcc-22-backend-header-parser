import type { Request, RequestHandler } from "express";
import type { ApiResponse, ApiResponseFail, ApiResponseSuccess } from "./types";

export const handleWhoAmI: RequestHandler<unknown, ApiResponse> = (
  req,
  res
) => {
  try {
    res.json(buildResponseSuccess(req));
  } catch (err) {
    res.json(buildResponseFail((err as Error).message));
  }
};

const throwIfUndefined = <T>(key: string, value: T): Exclude<T, undefined> => {
  if (!value) {
    throw new Error(`Could not retrieve the user's ${key}.`);
  }
  return value as Exclude<T, undefined>;
};

const getIpAddress = (req: Request<unknown>): string => {
  const ip = req.headers["x-forwarded-for"];

  if (Array.isArray(ip)) {
    return ip.join(".");
  }

  return throwIfUndefined("IP address", ip);
};

const getLanguage = (req: Request<unknown>): string => {
  const language = req.headers["accept-language"];
  return throwIfUndefined("language", language);
};

const getSoftware = (req: Request<unknown>): string => {
  const software = req.headers["user-agent"];
  return throwIfUndefined("software", software);
};

const buildResponseSuccess = (req: Request<unknown>): ApiResponseSuccess => {
  return {
    ipaddress: getIpAddress(req),
    language: getLanguage(req),
    software: getSoftware(req),
  };
};

const buildResponseFail = (message: string): ApiResponseFail => {
  return { error: message };
};
