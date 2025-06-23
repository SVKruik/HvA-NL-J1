import type { BsnValidationMessage } from "@/assets/enums";

export async function fetchApi(url: string): Promise<keyof typeof BsnValidationMessage> {
    try {
        const baseUrl = `${location.href}api`;
        const response = await fetch(baseUrl + url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        return "ERROR";
    }
}