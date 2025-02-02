import normal from "./lib/holt-winters.js";
import memo from "./lib/holt-winters-memoize.js";

normal.memo = memo;
export default normal;
