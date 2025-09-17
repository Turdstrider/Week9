import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Products } from './components/products/products';
import { Chat } from './components/chat/chat';

export const routes: Routes = [
    {
        path:'',
        component:Home
       
    },
    {
        path:'products',
        component:Products
    },
    {
        path:'chat',
        component:Chat
    }
];
