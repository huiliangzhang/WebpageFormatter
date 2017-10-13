import { NgModule } from '@angular/core';

import {
  MatSnackBarModule,
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
    MatSnackBarModule,
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
    MatSnackBarModule,
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
