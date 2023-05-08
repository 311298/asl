import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureRoutingModule, angularModules, featureComponents } from './feature-routing.module';
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
  declarations: [
    featureComponents,
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule,
    angularModules
  ],
  exports: [featureComponents]
})
export class FeatureModule { }
