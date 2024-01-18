import { chartConfig, chartSetup } from "@/utilities/chartController.js";

// Automatically picked up by Charts.js.
export const data = await chartSetup("#1F77B4", "ondernemers", "entrepreneurs");

// Automatically picked up by Charts.js.
export const options = chartConfig(10);
