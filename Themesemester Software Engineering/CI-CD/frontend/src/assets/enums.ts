export enum BsnValidationMessage {
    LENGTH = "The length of the BSN must be 8 or 9 digits.",
    INVALID_CHECKSUM = "The BSN is invalid.",
    INVALID_CHARACTERS = "The BSN may only contain digits.",
    EMTPY_INPUT = "The BSN may not be empty.",
    VALID = "The BSN is valid.",
    ERROR = "An error occurred while validating the BSN.",
} 