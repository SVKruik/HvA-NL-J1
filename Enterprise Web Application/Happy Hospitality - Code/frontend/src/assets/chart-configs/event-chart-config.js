import { chartConfig, chartSetup } from "@/utilities/chartController.js";

// Automatically picked up by Charts.js.
export const data = await chartSetup("#2CA02C", "evenementen", "events");

// Automatically picked up by Charts.js.
export const options = chartConfig(10);
