import { create, TwConfig } from "twrnc";

import twconfig from "../../tailwind.config";

const tw = create(twconfig as TwConfig);

export default tw;
