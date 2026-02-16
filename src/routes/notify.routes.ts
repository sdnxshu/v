import { Hono } from "hono";

import { notifyStock } from "@/controllers/stock.controller";
import { notifyCommodities } from "@/controllers/commodities.controller";
import { notifyPrecious } from "@/controllers/precious.controller";

const notifyRoutes = new Hono();

notifyRoutes.get("/stock/:symbol", notifyStock);
notifyRoutes.get("/commodities/:symbol", notifyCommodities);
notifyRoutes.get("/precious/:symbol", notifyPrecious);

export default notifyRoutes;
