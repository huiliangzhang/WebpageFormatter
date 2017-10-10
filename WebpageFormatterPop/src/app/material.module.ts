import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MdSortModule,
  MatCheckboxModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatSelectModule,
  MatTableModule,
  MatChipsModule,
  MatTooltipModule,
  MatInputModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MdSortModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatInputModule
  ],
  exports: [
    MatButtonModule,
    MdSortModule,
    MatCheckboxModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatInputModule
  ]
})
export class MaterialModule {}
