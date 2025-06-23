export type TseMessage = {
    timestamp: number;
    message: any;
}

export type TseRecording = {
    id: number;
    sent: number;
    received: number;
    difference: number;
    size: number
}