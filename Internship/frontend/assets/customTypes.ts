// Learning Goal Item
export type LearningGoalEntry = {
    "weekNumber": number,
    "ticketNumber": number,
    "timePlanned": number,
    "timeTaken": number,
    "timeTakenPercentage": number,
    "helpNeeded": number,
    "qaIterations": number,
    "incidents": number,
    "extras": number,
    "type": string,
    "categories": string,
    "languages": string,
    "dateCreation": string,
    "dateUpdated": string
}
export type LearningGoalEntryRaw = {
    "id": number,
    "week": number,
    "ticket": number,
    "time_planned": number,
    "time_taken": number,
    "time_taken_percentage": number,
    "help_needed": number,
    "qa_iterations": number,
    "incidents": number,
    "extras": number,
    "type": string,
    "category": string,
    "language": string,
    "date_creation": string,
    "date_updated": string
}

// Date Formatter
export type DateFormat = {
    "date": string,
    "time": string,
    "today": Date,
    "fullDate": string
}

// Uplink Network Payload
export type UplinkMessage = {
    "sender": string,
    "recipient": string,
    "triggerSource": string,
    "reason": string,
    "task": string,
    "content": string,
    "timestamp": Date
}

// Chart Data
export type ChartData = {
    "labels": Array<string>,
    "datasets": Array<ChartDataset>
}
export type ChartDataset = {
    "label": string,
    "data": Array<number>,
    "backgroundColor"?: Array<string> | string,
    "borderColor"?: string,
    "fill"?: boolean
}

// Learning Goal 0
export type LearningGoal0Result = {
    "week": number,
    "week_count": number
}

// Learning Goal 2
export type LearningGoal2Result = {
    "week": number,
    "avg_time_taken_percentage": number,
    "avg_qa_iterations": number,
    "avg_help_needed": number
}

// Learning Goal 3
export type LearningGoal3Result = {
    "week": number,
    "avg_time_planned": number,
    "avg_time_taken": number,
    "avg_incidents": number,
    "avg_extras": number
}

// Learning Goal 4
export type LearningGoal4RawResult = {
    "category": string,
    "language": string,
    "date_creation": string,
    "time_taken_hours": number
}
export type LearningGoal4RawResultType = {
    "total": Map<string, number>,
    "firstHalf": Map<string, number>,
    "secondHalf": Map<string, number>
}
type LearningGoal4ResultType = {
    "total": Array<number>,
    "firstHalf": Array<number>,
    "secondHalf": Array<number>
}
export type LearningGoal4Result = {
    "categoryNames": Array<string>
    "categoryCounts": LearningGoal4ResultType,
    "categoryHours": LearningGoal4ResultType,
    "languageNames": Array<string>,
    "languageCounts": LearningGoal4ResultType,
    "languageHours": LearningGoal4ResultType
}

// Table Header Types
export enum TableHeaderType {
    NUMBER = "number",
    PERCENTAGE = "percentage",
    DATE = "date",
    STRING = "string"
}

// Table Generic Types
export interface TableHeaderGenericItem {
    "id"?: number,
    "label": string,
    "type": TableHeaderType
}
export interface TableHeaderLearningGoal_Generic_Item extends TableHeaderGenericItem {
    "key": keyof TableDataLearningGoal_Generic["points"][0]
}
export type GenericRowItem = {
    "week": number,
    "value": number,
    "delta": number
}
export type TableDataLearningGoal_Generic = {
    "points": Array<GenericRowItem>,
    "tableHeaders": Array<TableHeaderLearningGoal_Generic_Item>
}
export type LearningGoal_Generic_Datasets = {
    "goalData_2_1": any,
    "goalData_2_2": any,
    "goalData_2_3": any,
    "goalData_3_1": any,
    "goalData_3_2": any
}

// Table All Data
export type TableAllData = {
    "points": Array<LearningGoalEntry>,
    "tableHeaders": Array<TableHeaderAllItem>
}
export interface TableHeaderAllItem extends TableHeaderGenericItem {
    "value": keyof LearningGoalEntry
}

// Table - Learning Goal 3
export type TableDataLearningGoal_3_Item = {
    "tableHeaders": Array<TableHeaderLearningGoal_Generic_Item>,
    "setA": Array<GenericRowItem>,
    "setB": Array<GenericRowItem>,
}

// Table - Learning Goal 4
export type TableDataLearningGoal_4_Item = {
    "label": string,
    "points": Array<any>,
    "tableHeaders": Array<TableHeaderGenericItem>
}
export type LearningGoal_4_Datasets = {
    "goalData_4_1": any,
    "goalData_4_2": any
}
