import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { Routes } from '@angular/router';

export const ROUTES: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'about', component: AboutComponent},
    {path: 'home', component: HomeComponent},
    {path: 'products', component: ProductsComponent}
  ];