import type { TwConfig } from "twrnc";
import { create } from "twrnc";

import twconfig from "../../tailwind.config";

const tw = create(twconfig as TwConfig);

export default tw;
