import { createRouter, createWebHistory } from 'vue-router';
import BlogIndexView from '@/views/BlogIndexView.vue';
import CategoryIndexView from '@/views/CategoryIndexView.vue';
import AboutView from '@/views/AboutView.vue';
import ContactView from '@/views/ContactView.vue';
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue';
import TermsOfServiceView from '@/views/TermsOfServiceView.vue';
import ArticleView from '@/views/ArticleView.vue';
import DisclaimerView from '@/views/DisclaimerView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: BlogIndexView
  },
  {
    path: '/page/:page',
    name: 'home-paginated',
    component: BlogIndexView,
    props: true
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoryIndexView
  },
  {
    path: '/category/:categorySlug',
    name: 'category',
    component: BlogIndexView,
    props: true
  },
  {
    path: '/category/:categorySlug/page/:page',
    name: 'category-paginated',
    component: BlogIndexView,
    props: true
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicyView
  },
  {
    path: '/terms-of-service',
    name: 'terms-of-service',
    component: TermsOfServiceView
  },
  {
    path: '/disclaimer',
    name: 'disclaimer',
    component: DisclaimerView
  },
  {
    path: '/:slug',
    name: 'post',
    component: ArticleView,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
});

export default router;