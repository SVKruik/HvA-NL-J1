import { chartConfig, chartSetup } from "@/utilities/chartController.js";

// Automatically picked up by Charts.js.
export const data = await chartSetup("#FF7F0E", "artikelen", "posts");

// Automatically picked up by Charts.js.
export const options = chartConfig(10);
