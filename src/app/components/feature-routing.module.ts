import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TableComponent } from "./table/table.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from "./sidenav/sidenav.component";

const featureRoute: Routes = [
    { path: 'table', component: TableComponent },
    { path: 'sidenav', component: SidenavComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(featureRoute)],
    exports: [RouterModule]
})

export class FeatureRoutingModule { }
export const featureComponents = [
    TableComponent,
    SidenavComponent
]
export const angularModules = [ // modules imported
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    MatSelectModule,
    MatSidenavModule
]