import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { Dashboard } from './dashboard/dashboard';
import { NotFound } from './not-found/not-found';
import { Home } from './layout/home/home';
import { Login } from './layout/login/login';
import { Register } from './layout/register/register';
import { Faqs } from './layout/faqs/faqs';
import { Orders } from './layout/orders/orders';
import { Profile } from './layout/profile/profile';
import { ProductDetails } from './layout/product-details/product-details';
import { Cart } from './layout/cart/cart';
import { adminGuard, superAdminGuard, userGuard } from './core/guards/auth-guard';
import { DashProducts } from './dashboard/dash-products/dash-products';
import { DashAdmins } from './dashboard/dash-admins/dash-admins';
import { DashCategories } from './dashboard/dash-categories/dash-categories';
import { DashFaqs } from './dashboard/dash-faqs/dash-faqs';
import { DashOrders } from './dashboard/dash-orders/dash-orders';
import { DashTestimonials } from './dashboard/dash-testimonials/dash-testimonials';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home, title: 'Home' },
      { path: 'product/:slug', component: ProductDetails, title: 'Product Details' },
      { path: 'register', component: Register, title: 'Register' },
      { path: 'login', component: Login, title: 'Login' },
      { path: 'cart', component: Cart, title: 'Cart' },
      { path: 'orders', component: Orders, canActivate: [userGuard], title: 'Orders' },
      { path: 'profile', component: Profile, canActivate: [userGuard], title: 'Profile' },
      { path: 'FAQs', component: Faqs, title: 'FAQs' },
    ],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: DashProducts, title: 'Dashboard - Products' },
      { path: 'categories', component: DashCategories, title: 'Dashboard - Categories' },
      { path: 'orders', component: DashOrders, title: 'Dashboard - Orders' },
      { path: 'testimonials', component: DashTestimonials, title: 'Dashboard - Testimonials' },
      { path: 'FAQs', component: DashFaqs, title: 'Dashboard - FAQs' },
      {
        path: 'admins',
        component: DashAdmins,
        canActivate: [superAdminGuard],
        title: 'Dashboard - Admin',
      },
    ],
  },
  { path: '**', component: NotFound, title: 'Not Found' },
];
