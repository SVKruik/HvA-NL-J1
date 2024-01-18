import { chartConfig, chartSetup } from "@/utilities/chartController.js";

// Automatically picked up by Charts.js.
export const data = await chartSetup("#9467BD", "partners", "partners");

// Automatically picked up by Charts.js.
export const options = chartConfig(10);
