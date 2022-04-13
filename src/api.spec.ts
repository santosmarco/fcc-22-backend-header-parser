import type { Request, Response } from "express";
import { handleWhoAmI } from "./api";
import type { ApiResponse, ApiResponseSuccess } from "./types";

const testResponse = <T extends ApiResponse = ApiResponse>(
  ipAddress: string,
  language: string,
  software: string
): T => {
  const req = {
    headers: {
      "x-forwarded-for": ipAddress,
      "accept-language": language,
      "user-agent": software,
    },
  };

  let resBody = {} as T;

  const res = {
    json: jest.fn((arg) => {
      resBody = arg;
    }),
  };

  handleWhoAmI(
    req as unknown as Request,
    res as unknown as Response,
    jest.fn()
  );

  return resBody;
};

describe("api", () => {
  describe("handleWhoAmI", () => {
    let testIpAddress = "159.20.14.100";
    let testLanguage = "en-US,en;q=0.5";
    let testSoftware =
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0";
    let testRes = testResponse<ApiResponseSuccess>(
      testIpAddress,
      testLanguage,
      testSoftware
    );

    describe("ipaddress", () => {
      it("should contain the `ipaddress` key", () => {
        expect(Object.keys(testRes)).toContain("ipaddress");
      });

      it("should be a string", () => {
        expect(typeof testRes.ipaddress).toBe("string");
      });

      it("should have the correct value", () => {
        expect(testRes.ipaddress).toBe("159.20.14.100");
      });
    });

    describe("language", () => {
      it("should contain the `language` key", () => {
        expect(Object.keys(testRes)).toContain("language");
      });

      it("should be a string", () => {
        expect(typeof testRes.language).toBe("string");
      });

      it("should have the correct value", () => {
        expect(testRes.language).toBe("en-US,en;q=0.5");
      });
    });

    describe("software", () => {
      it("should contain the `software` key", () => {
        expect(Object.keys(testRes)).toContain("software");
      });

      it("should be a string", () => {
        expect(typeof testRes.software).toBe("string");
      });

      it("should have the correct value", () => {
        expect(testRes.software).toBe(
          "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0"
        );
      });
    });
  });
});
