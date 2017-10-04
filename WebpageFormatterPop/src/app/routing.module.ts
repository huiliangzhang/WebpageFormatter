import { NgModule } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { AppComponent } from './app.component';

import { CustomcodeComponent } from './customcode/customcode.component';
import { ClicktotriggerComponent } from './clicktotrigger/clicktotrigger.component';

const routes: Routes = [
    {
        path: 'customcode',
        component: CustomcodeComponent
    },
    {
        path: 'clicktotrigger',
        component: ClicktotriggerComponent
    },
    {
        path: '',
        redirectTo: 'clicktotrigger',
        pathMatch: 'full'
    },
    { path: '**', component: ClicktotriggerComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


