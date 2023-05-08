import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ITable } from "../models/table.model";

@Injectable({
    providedIn: 'root'
})

export class TableService {

    constructor(
        private httpClient: HttpClient
    ) { }

    // get table data from the json-server -- 3000/tableData
    getTableData() {
        return this.httpClient.get<ITable[]>('http://localhost:3000/tableData')
    }

    putTableData(index: number, editData: ITable) {
        return this.httpClient.put<ITable>("http://localhost:3000/tableData" + '/' + index, editData)
    }

    deleteTableRow(index: number) {
        return this.httpClient.delete<ITable>("http://localhost:3000/tableData" + '/' + index)
    }
}