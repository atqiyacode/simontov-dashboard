import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import AppGuestLayoutVue from '@/layout/AppGuestLayout.vue';
import AppMapLayout from '@/layout/AppMapLayout.vue';
import { useUserStore } from '@/services/user.store';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
    pathToRegexpOptions: {
        strict: true
    },
    scrollBehavior() {
        window.scrollTo(0, 0);
    },
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/',
                    redirect: '/app/dashboard/realtime'
                },
                {
                    path: '/app/dashboard',
                    children: [
                        {
                            path: 'realtime',
                            name: 'dashboard',
                            component: () => import('@/views/Dashboard.vue'),
                            meta: {
                                title: 'Dashboard realtime'
                            }
                        },
                        {
                            path: 'static',
                            name: 'dashboard-static',
                            component: () => import('@/views/StaticChartPage.vue'),
                            meta: {
                                title: 'Dashboard Static'
                            }
                        }
                    ]
                },
                {
                    path: 'my-notification',
                    name: 'my-notification',
                    component: () => import('@/views/MyNotificationPage.vue'),
                    meta: {
                        title: 'My Notification'
                    }
                },
                // master data auth
                {
                    path: '/app/master',
                    children: [
                        {
                            path: 'role',
                            name: 'master-role',
                            component: () => import('@/views/master/RolePage.vue'),
                            meta: {
                                title: 'Role Data'
                            }
                        },
                        {
                            path: 'permission',
                            name: 'master-permission',
                            component: () => import('@/views/master/PermissionPage.vue'),
                            meta: {
                                title: 'Permission Data'
                            }
                        },
                        {
                            path: 'user',
                            name: 'master-user',
                            component: () => import('@/views/master/UserPage.vue'),
                            meta: {
                                title: 'User Data'
                            }
                        },
                        {
                            path: 'user/detail/:id',
                            name: 'master-user-detail',
                            component: () => import('@/views/master/UserDetailPage.vue'),
                            meta: {
                                title: 'User Data'
                            }
                        },
                        {
                            path: 'location',
                            name: 'master-location',
                            component: () => import('@/views/master/LocationPage.vue'),
                            meta: {
                                title: 'Lokasi Data'
                            }
                        },
                        {
                            path: 'alert-notification-type',
                            name: 'master-alert-notification-type',
                            component: () => import('@/views/master/AlertNotificationTypePage.vue'),
                            meta: {
                                title: 'Notification Type'
                            }
                        },
                        {
                            path: 'location-notification',
                            name: 'master-location-notification-type',
                            component: () => import('@/views/master/LocationNotificationPage.vue'),
                            meta: {
                                title: 'Location Notification'
                            }
                        },
                        {
                            path: 'dashboard-chart',
                            name: 'master-dashboard-chart',
                            component: () => import('@/views/master/DashboardChartPage.vue'),
                            meta: {
                                title: 'DashboardChartPage Data'
                            }
                        },

                        {
                            path: 'tax',
                            name: 'master-tax',
                            component: () => import('@/views/master/TaxPage.vue'),
                            meta: {
                                title: 'Pajak Data'
                            }
                        }
                    ]
                },
                {
                    path: '/app/billing',
                    children: [
                        {
                            path: 'range-type',
                            name: 'billing-range-type',
                            component: () => import('@/views/billing/RangeTypePage.vue'),
                            meta: {
                                title: 'Range Type Data'
                            }
                        },
                        {
                            path: 'range-cost',
                            name: 'billing-range-cost',
                            component: () => import('@/views/billing/RangeCostPage.vue'),
                            meta: {
                                title: 'Range Cost Data'
                            }
                        }
                    ]
                },
                {
                    path: '/app/feature',
                    children: [
                        {
                            path: 'topic',
                            name: 'feature-topic',
                            component: () => import('@/views/features/TopicPage.vue'),
                            meta: {
                                title: 'Topic Data'
                            }
                        },
                        {
                            path: 'status-alarm',
                            name: 'feature-status-alarm',
                            component: () => import('@/views/features/StatusAlarmPage.vue'),
                            meta: {
                                title: 'Lokasi Data'
                            }
                        },
                        {
                            path: 'flowrate',
                            name: 'feature-flowrate',
                            component: () => import('@/views/features/FlowratePage.vue'),
                            meta: {
                                title: 'Flowrate Data'
                            }
                        }
                    ]
                }
            ]
        },

        {
            path: '/select-location',
            component: AppMapLayout,
            children: [
                {
                    path: '',
                    name: 'select-location',
                    component: () => import('@/views/SelectLocationPage.vue'),
                    meta: {
                        requiresAuth: true,
                        title: 'Location'
                    }
                }
            ]
        },

        // authentication
        {
            path: '/auth',
            component: AppGuestLayoutVue,
            children: [
                {
                    path: 'login',
                    name: 'login',
                    component: () => import('@/views/auth/LoginPage.vue'),
                    meta: {
                        requiresAuth: false,
                        title: 'Login'
                    }
                },
                {
                    path: 'verify',
                    name: 'auth-verification',
                    component: () => import('@/views/auth/AuthVerificationPage.vue'),
                    meta: {
                        requiresAuth: false,
                        title: 'Verification'
                    }
                },
                {
                    path: 'forgot-password',
                    name: 'forgot-password',
                    component: () => import('@/views/auth/ForgotPasswordPage.vue'),
                    meta: {
                        requiresAuth: false,
                        title: 'Forgot Password'
                    }
                },
                {
                    path: 'verify-email',
                    name: 'verify-email',
                    component: () => import('@/views/auth/EmailVerificationPage.vue'),
                    meta: {
                        requiresAuth: true,
                        title: 'Verification'
                    }
                }
            ]
        },
        {
            path: '/verify-email',
            name: 'verify-email-authentication',
            component: () => import('@/views/auth/EmailVerificationUserPage.vue'),
            meta: {
                requiresAuth: true,
                title: 'Verification'
            }
        },
        {
            path: '/password-reset/:token',
            name: 'password-reset',
            component: () => import('@/views/auth/ResetPasswordPage.vue'),
            meta: {
                requiresAuth: false,
                title: 'Reset Password'
            }
        },

        // error page
        {
            path: '/no-access-permission',
            name: 'no-access-permission',
            component: () => import('@/views/_errors/NoAccessPermissionPage.vue'),
            meta: {
                title: 'No Access Permission'
            }
        },
        {
            path: '/data-not-found',
            name: 'data-not-found',
            component: () => import('@/views/_errors/NotFoundData.vue'),
            meta: {
                title: 'Data Not Found'
            }
        },

        {
            path: '/:pathMatch(.*)*',
            name: 'page-not-found',
            component: () => import('@/views/_errors/NotFoundPage.vue'),
            meta: {
                title: 'Page Not Found'
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const { isLoggedIn } = useUserStore();

    if (to.name === 'login' && isLoggedIn) {
        next({ name: 'dashboard' });
        return;
    }

    if (!to.matched.some((record) => record.meta.requiresAuth) || isLoggedIn) {
        next();
        return;
    }

    next({ name: 'login' });
});

export default router;
