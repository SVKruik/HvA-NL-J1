// Date Formatter
export type DateFormat = {
    "date": string,
    "time": string,
    "today": Date,
    "fullDate": string
}

// Integration
export type IntegrationItem = {
    "id": number,
    "name": string,
    "base_url": string,
    "key": string,
    "description": string,
}

export type NewIntegrationItem = {
    "name": string,
    "baseUrl": string,
    "key": string,
    "description": string,
}