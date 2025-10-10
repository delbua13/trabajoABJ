import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
import { LoginComponent } from './login/login.component';
import { ResultadosComponent } from './resultados/resultados.component';
import { Guardian } from '../guardian';

export const routes: Routes = [
    {
        path:'',
        component:LoginComponent, canActivate:[Guardian]
    },
    {
        path:'ejercicios',
        component:EjerciciosComponent, canActivate:[Guardian]
    },
    {
        path:'resultados',
        component:ResultadosComponent, canActivate:[Guardian]
    },
    {
        path:'**',
        redirectTo:'',
    }
];
