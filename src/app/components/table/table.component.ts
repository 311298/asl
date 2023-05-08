import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { IEmployed, ITable } from 'src/app/models/table.model';
import { TableService } from 'src/app/service/table.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'fullName', 'age', 'employed', 'action'];
  // dataSource!: MatTableDataSource<ITable>;
  // dataSource = new MatTableDataSource<ITable>()
  dataSource = new MatTableDataSource<any>()
  tableDataList: ITable[] = []
  trueFalseList: IEmployed[] = [ // true false list
    { value: true, viewValue: true },
    { value: false, viewValue: false }
  ]
  formGroup!: FormGroup;
  customSub!: Subscription;
  EditButton: boolean = true
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // tempTableRowData!:ITable

  constructor(
    private service: TableService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      rows: this.fb.array([])
    })
    this.fetchTableData()
  }

  initializeForm(tableData: ITable[]) {
    this.formGroup = this.fb.group({
      rows: this.fb.array(tableData.map((value: ITable) => this.fb.group({
        id: [{ value: value.id, disabled: true }],
        fullName: [{ value: value.fullName, disabled: true }],
        age: [{ value: value.age, disabled: true }],
        employed: [{ value: value.employed, disabled: true }],
        // employed: [value.employed],
        action: ['existingRecords'],
        isEditable: [true]
      })))
    })
    this.dataSource = new MatTableDataSource((this.formGroup.get('rows') as FormArray).controls)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
    // this.formGroup.disable()
  }

  fetchTableData() {
    this.tableDataList = []
    this.customSub = this.service.getTableData().subscribe({
      next: (response) => {
        response.forEach(element => {
          let singleRow: ITable = {
            id: 1,
            fullName: '',
            age: 1,
            employed: false,
            action: 'existingRecords',
            isEditable: true
          }
          singleRow.id = element.id
          singleRow.fullName = element.fullName
          singleRow.age = element.age
          singleRow.employed = element.employed
          this.tableDataList.push(singleRow)
        });
        // console.log(this.tableDataList)
        // console.log(response)
        // this.dataSource = new MatTableDataSource(response)
        // this.dataSource.paginator = this.paginator
        // this.dataSource.sort = this.sort

      },
      error: (err) => {
        console.log(`error happened!! ${err}`)
      },
      complete: () => {
        this.initializeForm(this.tableDataList)
        console.log('complete!!')
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  tempTableRowData: ITable = {
    id: 0,
    fullName: '',
    age: 0,
    employed: false
  }

  onDelete(index: number) {
    // add the logic for delete simple as before
    let id = (this.formGroup.get('rows') as FormArray).at(index).get('id')?.value
    // we are getting the actual id value since we have an formarray starts with zero

    this.customSub = this.service.deleteTableRow(id).subscribe({
      next: (response) => {
        // do nothing
      },
      error: (err) => {
        console.log(`error happended while deleting the particular row ${err}`)
      },
      complete: () => {
        console.log(`delete operation done`)
        this.fetchTableData() // not rendering the data properly in table
      }
    })
  }

  onCancel(index: number) {
    (this.formGroup.get('rows') as FormArray).at(index).get('isEditable')?.patchValue(true);
    this.EditButton = !this.EditButton;

    (<FormArray>this.formGroup.get('rows')).at(index).get('fullName')?.disable();
    (<FormArray>this.formGroup.get('rows')).at(index).get('age')?.disable();
    (<FormArray>this.formGroup.get('rows')).at(index).get('id')?.disable();
    (<FormArray>this.formGroup.get('rows')).at(index).get('employed')?.disable();

    // get back the original value after cancel operation
    (this.formGroup.get('rows') as FormArray).at(index).patchValue({
      id: this.tempTableRowData.id,
      age: this.tempTableRowData.age,
      employed: this.tempTableRowData.employed,
      fullName: this.tempTableRowData.fullName,
    })
  }

  onEdit(index: number) {
    (this.formGroup.get('rows') as FormArray).at(index).get('isEditable')?.patchValue(false)
    this.EditButton = !this.EditButton;

    // enabling the formControls for editing
    (<FormArray>this.formGroup.get('rows')).at(index).get('fullName')?.enable();
    (<FormArray>this.formGroup.get('rows')).at(index).get('age')?.enable();
    (<FormArray>this.formGroup.get('rows')).at(index).get('id')?.enable();
    (<FormArray>this.formGroup.get('rows')).at(index).get('employed')?.enable();

    // saving the temporary data for editing
    this.tempTableRowData = {
      id: (<FormArray>this.formGroup.get('rows')).at(index).get('id')?.value,
      fullName: (<FormArray>this.formGroup.get('rows')).at(index).get('fullName')?.value,
      age: (<FormArray>this.formGroup.get('rows')).at(index).get('age')?.value,
      employed: (<FormArray>this.formGroup.get('rows')).at(index).get('employed')?.value
    }
  }

  onSave(index: number) {
    (this.formGroup.get('rows') as FormArray).at(index).get('isEditable')?.patchValue(true)
    this.EditButton = !this.EditButton;

    (<FormArray>this.formGroup.get('rows')).at(index).get('fullName')?.disable();
    (<FormArray>this.formGroup.get('rows')).at(index).get('age')?.disable();
    (<FormArray>this.formGroup.get('rows')).at(index).get('id')?.disable();
    (<FormArray>this.formGroup.get('rows')).at(index).get('employed')?.disable();

    // current table data
    let editData = {
      id: +(<FormArray>this.formGroup.get('rows')).at(index).get('id')?.value,
      fullName: (<FormArray>this.formGroup.get('rows')).at(index).get('fullName')?.value,
      age: +(<FormArray>this.formGroup.get('rows')).at(index).get('age')?.value,
      employed: (<FormArray>this.formGroup.get('rows')).at(index).get('employed')?.value
    }

    this.customSub = this.service.putTableData(index + 1, editData).subscribe({
      next: (response) => {
        // do nothing
        // console.log(this.tempTableRowData)
      },
      error: (err) => {
        console.log(`error happened while changing the data at server, ${err}`)
      },
      complete: () => {
        console.log(`successfully changed!`)
      }
    })
  }


  ngOnDestroy(): void {
    this.customSub.unsubscribe()
  }

}
