import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import AppGuestLayoutVue from '@/layout/AppGuestLayout.vue';
import { useUserStore } from '../services/user.store';

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
            redirect: '/dashboard',
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: {
                        requiresAuth: true,
                        title: 'Dashboard'
                    }
                },
                // master data auth
                {
                    path: '/master/main',
                    meta: {
                        requiresAuth: true
                    },
                    children: [
                        {
                            path: 'role',
                            name: 'master-role',
                            component: () => import('@/views/master/main/RolePage.vue'),
                            meta: {
                                title: 'Role Data',
                                role: ['superadmin']
                            }
                        },
                        {
                            path: 'permission',
                            name: 'master-permission',
                            component: () => import('@/views/master/main/PermissionPage.vue'),
                            meta: {
                                title: 'Permission Data',
                                role: ['superadmin']
                            }
                        }
                    ]
                },

                // master account
                {
                    path: '/master/account',
                    meta: {
                        requiresAuth: true
                    },
                    children: [
                        {
                            path: 'user',
                            name: 'master-user',
                            component: () => import('@/views/master/account/UserPage.vue'),
                            meta: {
                                title: 'User Data',
                                role: ['superadmin']
                            }
                        }
                    ]
                },

                // feature
                {
                    path: '/feature',
                    meta: {
                        requiresAuth: true
                    },
                    children: [
                        {
                            path: 'flowrate',
                            name: 'feature-flowrate',
                            component: () => import('@/views/features/flowrate/IndexPage.vue'),
                            meta: {
                                title: 'Flowrate Data',
                                role: ['superadmin']
                            }
                        },
                        {
                            path: 'status-alarm',
                            name: 'feature-status-alarm',
                            component: () => import('@/views/features/status-alarm/IndexPage.vue'),
                            meta: {
                                title: 'Status Alarm Data',
                                role: ['superadmin']
                            }
                        },
                        {
                            path: 'range-type',
                            name: 'feature-range-type',
                            component: () => import('@/views/features/range-type/IndexPage.vue'),
                            meta: {
                                title: 'Range Type',
                                role: ['superadmin']
                            }
                        },
                        {
                            path: 'range-cost',
                            name: 'feature-range-cost',
                            component: () => import('@/views/features/range-cost/IndexPage.vue'),
                            meta: {
                                title: 'Range Cost',
                                role: ['superadmin']
                            }
                        }
                    ]
                }
            ]
        },

        // authentication
        {
            path: '/auth',
            component: AppGuestLayoutVue,
            meta: {
                requiresAuth: false
            },
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
                    path: 'forgot-password',
                    name: 'forgot-password',
                    component: () => import('@/views/auth/ForgotPasswordPage.vue'),
                    meta: {
                        requiresAuth: false,
                        title: 'Forgot Password'
                    }
                }
            ]
        },

        {
            path: '/email-verification',
            name: 'email-verification',
            component: () => import('@/views/auth/EmailVerificationPage.vue'),
            meta: {
                requiresAuth: true,
                title: 'Email Verification'
            }
        },

        {
            path: '/verify-email',
            name: 'verify-email',
            component: () => import('@/views/auth/CheckEmailVerificationPage.vue'),
            meta: {
                requiresAuth: true,
                title: 'Email Verification'
            }
        },

        {
            path: '/password-reset/:token',
            name: 'password-reset',
            component: () => import('@/views/auth/PasswordResetPage.vue'),
            meta: {
                requiresAuth: false,
                title: 'Password Reset'
            }
        },

        // error page
        {
            path: '/no-access-permission',
            name: 'no-access-permission',
            component: () => import('@/views/error-pages/NoAccessPermissionPage.vue'),
            meta: {
                title: 'No Access Permission'
            }
        },
        {
            path: '/data-not-found',
            name: 'data-not-found',
            component: () => import('@/views/error-pages/NotFoundData.vue'),
            meta: {
                title: 'Data Not Found'
            }
        },

        {
            path: '/:pathMatch(.*)*',
            name: 'page-not-found',
            component: () => import('@/views/error-pages/NotFoundPage.vue'),
            meta: {
                title: 'Page Not Found'
            }
        }
    ]
});

function multipleInArray(arr, values) {
    return values.some((value) => {
        return arr.includes(value);
    });
}

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const nearestWithTitle = to.matched
        .slice()
        .reverse()
        .find((r) => r.meta && r.meta.title);

    if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

    if (to.name === 'login' && userStore.isLoggedIn) {
        if (!userStore.isVerified) {
            next({ name: 'email-verification' });
        } else {
            next({ name: 'dashboard' });
        }
    } else if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!userStore.isLoggedIn) {
            next({ name: 'login' });
        } else {
            if (to.matched.some((record) => record.meta.role)) {
                if (multipleInArray(userStore.user.roles, to.meta.role)) {
                    next();
                } else {
                    next({ name: 'no-access-permission' });
                }
            } else {
                next();
            }
        }
    } else {
        next();
    }
});

export default router;
