import { AboutModule } from './components/about/about.module';
import { BrowserModule } from '@angular/platform-browser';
import { HomeModule } from './components/home/home.module';
import { ProductsModule } from './components/products/products.module';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.module.routes';

export let IMPORTS = [
    AboutModule,
    BrowserModule,
    HomeModule,
    ProductsModule,
    RouterModule.forRoot(ROUTES, {useHash: false}),
  ]