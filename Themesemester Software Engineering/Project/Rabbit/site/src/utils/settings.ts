// Website settings and configuration

import { NotificationTypes } from "~/assets/customTypes";

/**
 * Retrieves a list of pages where the sidebar should not be displayed.
 * 
 * @returns {string[]} An array of strings representing the paths to be excluded from the sidebar.
 */
export function getSidebarExcludes(): Array<string> {
    return ["login", "register"];
}

/**
 * Checks if the sidebar should be excluded based on the current route.
 * 
 * @returns {ComputedRef<boolean>} A referenced boolean indicating whether the sidebar should be excluded based on the current route.
 */
export function isSidebarExcluded(): ComputedRef<boolean> {
    return computed(() => getSidebarExcludes().some((path: string) => useRoute().path.startsWith("/" + path)));
}

/**
 * Returns an array of notification types that should not be shown nor persisted.
 * This does not prohibit sending them to the client.
 * @returns An array of notification types that should be excluded.
 */
export function getExclusions(): Array<NotificationTypes> {
    return [
        NotificationTypes.initialize,
        NotificationTypes.acknowledge,
        NotificationTypes.buddyRemoved,
    ];
}