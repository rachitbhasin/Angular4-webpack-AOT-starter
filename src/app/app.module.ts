import { ContactsModule } from './components/contacts/contacts.module';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ProductsComponent } from './components/products/products.component';
import { NavBarComponent } from './components/nav/nav-bar.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
//import { ROUTES } from './app.module.routes';
import { RouterModule, Routes } from '@angular/router';
import { ProductsModule } from './components/products/products.module';
import { HomeModule } from './components/home/home.module';
import { BrowserModule } from '@angular/platform-browser';
import { AboutModule } from './components/about/about.module';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';

import { DECLARATIONS } from './app.module.declarations';
import { IMPORTS } from './app.modules.imports';

import { AppComponent } from './components/app.component';


export const ROUTES: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'about', component: AboutComponent},
    {path: 'home', component: HomeComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'contacts', component: ContactsComponent}
  ];

@NgModule({
  bootstrap: [
    AppComponent
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'}
  ],
  declarations: [
    AboutComponent,
    AppComponent,
    ContactsComponent,
    HomeComponent,
    NavBarComponent,
    ProductsComponent
],
  imports: [
    AboutModule,
    BrowserModule,
    ContactsModule,
    HomeModule,
    ProductsModule,
    RouterModule.forRoot(ROUTES, {useHash: false}),
  ]
})
export class AppModule {}
