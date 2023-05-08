export interface ITable {
    id: number
    fullName: string
    age: number
    employed: boolean
    action?: string
    isEditable?: boolean
}

export interface IEmployed {
    value: boolean
    viewValue: boolean
}