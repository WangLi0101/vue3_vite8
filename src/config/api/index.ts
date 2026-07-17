const mode = import.meta.env.MODE;

type ServiceUrlMap = {
  MOCK: string;
  SYSTEM: string;
  SUPPORT: string;
  PLAN: string;
  TENDER: string;
};

const resolveServiceUrlMap = (): ServiceUrlMap => {
  switch (mode) {
    case "development":
      return {
        MOCK: "/api",
        SYSTEM: "http://172.20.22.3:8080/system/api",
        SUPPORT: "http://172.20.22.3:8080/support/api",
        PLAN: "http://172.20.22.3:8080/plan/api",
        TENDER: "http://172.20.22.3:8080/tender/api",
      };
    case "staging":
      return {
        MOCK: "/api",
        SYSTEM: "http://39.105.81.250:60001/system/api",
        SUPPORT: "http://39.105.81.250:60001/support/api",
        PLAN: "http://39.105.81.250:60001/plan/api",
        TENDER: "http://39.105.81.250:60001/tender/api",
      };
    default:
      return {
        MOCK: "/api",
        SYSTEM: "",
        SUPPORT: "",
        PLAN: "",
        TENDER: "",
      };
  }
};

export const SERVICE_URL_MAP = resolveServiceUrlMap();
export type ServiceName = keyof typeof SERVICE_URL_MAP;
