import baseCors from "cors";
import { env } from "./env";

export const cors = () =>
  baseCors({
    origin: (origin, callback) => {
      if (origin && origin !== env.CLIENT_URL) {
        return callback(new Error("Not allowed by CORS"));
      }

      return callback(null, true);
    },
  });
