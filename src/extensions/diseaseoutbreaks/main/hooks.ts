import { useEffect } from "react";

import { postMsg } from "@/shared/utils";

export default () => {
  useEffect(() => {
    postMsg("init");
  }, []);

  return {};
};
