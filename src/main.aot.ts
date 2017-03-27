import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../build/src/app/app.module.ngfactory';


document.addEventListener('DOMContentLoaded', () => {
  platformBrowser()
    .bootstrapModuleFactory(AppModuleNgFactory)
    .catch(error => console.error(error));
});
