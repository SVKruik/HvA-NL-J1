import type { Peer } from "crossws";

const peerMap = new Map<number, Peer>();
log("[RTD / Server] Peer registry initialized.", "info");

/**
 * Regster a RTD connection peer by hopper ID.
 * @param hopperId The ID of the hopper to register.
 * @param peer The RTD connection peer to register.
 */
export function registerPeer(hopperId: number, peer: Peer): void {
    peerMap.set(hopperId, peer);
}

/**
 * Unregister a RTD connection peer by hopper ID.
 * @param hopperId The ID of the hopper to unregister.
 */
export function unregisterPeer(hopperId: number): void {
    peerMap.delete(hopperId);
}

/**
 * Get a RTD connection peer by hopper ID.
 * @param hopperId The ID of the hopper to get the peer for.
 * @returns The peer associated with the given hopper ID, or undefined if not found.
 */
export function getPeer(hopperId: number): Peer | undefined {
    return peerMap.get(hopperId);
}
