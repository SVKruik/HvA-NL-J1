import type { IntegrationItem, NewIntegrationItem } from "~/assets/customTypes";

export const useFetchIntegrations = async (): Promise<Array<IntegrationItem> | number> => {
    return await $fetch("/api/integrations");
}

export const useFetchTestIntegration = async (id: number): Promise<any | number> => {
    return await $fetch(`/api/test/${id}`);
}

export const useFetchAddIntegration = async (data: NewIntegrationItem): Promise<any | number> => {
    return await $fetch("/api/new", {
        method: "POST",
        body: JSON.stringify(data)
    });
}