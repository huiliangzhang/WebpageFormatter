import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatSelectModule,
  MatTableModule,
  MatChipsModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule
  ]
})
export class MaterialModule {}
