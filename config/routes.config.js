export default [
    {
        path: '/',
        component: '../layouts/index.js',
        breadcrumb: '首页',
        routes: [
            {
                path: '/',
                component: './index.js',
                breadcrumb: '个人中心',
                title: '乐莎莎管理后台-个人中心'
            },
            {
                path: '/usercenter',
                component: './usercenter',
                breadcrumb: '个人中心',
                title: '乐莎莎管理后台-个人中心'
            },
            {
                path: '/systemsetting',
                breadcrumb: '系统设置',
                routes: [
                    {
                        path: '/systemsetting/accountmanagement',
                        component: './systemsetting/accountmanagement',
                        breadcrumb: '账号管理',
                        title: '乐莎莎管理后台-账号管理'
                    },
                    {
                        path: '/systemsetting/accountauth',
                        component: './systemsetting/accountauth',
                        breadcrumb: '权限管理',
                        title: '乐莎莎管理后台-权限管理'
                    },
                    {
                        path: '/systemsetting/organization',
                        component: './systemsetting/organization',
                        breadcrumb: '组织结构',
                        title: '乐莎莎管理后台-组织结构'
                    }
                ]
            },
            {
                path: '/custommanagement',
                breadcrumb: '客户管理',
                routes: [
                    {
                        path: '/custommanagement/custominfo',
                        component: './custommanagement/custominfo',
                        breadcrumb: '客户信息',
                        title: '乐莎莎管理后台-客户信息'
                    }
                ]
            },
            {
                path: '/outpatientmanagement',
                breadcrumb: '门诊管理',
                routes: [
                    {
                        path: '/outpatientmanagement/outpatientinfo',
                        component: './outpatientmanagement/outpatientinfo',
                        breadcrumb: '门诊信息',
                        title: '乐莎莎管理后台-门诊信息'
                    },
                    {
                        path: '/outpatientmanagement/doctormanagement',
                        component: './outpatientmanagement/doctormanagement',
                        breadcrumb: '医生管理',
                        title: '乐莎莎管理后台-医生管理'
                    }
                ]
            },
            {
                path: '/worktaskmanagement',
                breadcrumb: '工单管理',
                routes: [
                    {
                        path: '/worktaskmanagement/sharingCustomer',
                        component: './worktaskmanagement/sharingCustomer',
                        breadcrumb: '共享客户',
                        title: '乐莎莎管理后台-共享客户'
                    },
                    {
                        path: '/worktaskmanagement/allworktask',
                        component: './worktaskmanagement/allworktask',
                        breadcrumb: '全部工单',
                        title: '乐莎莎管理后台-全部工单'
                    },
                    {
                        path: '/worktaskmanagement/waitdistribution',
                        component: './worktaskmanagement/waitdistribution',
                        breadcrumb: '待分配工单',
                        title: '乐莎莎管理后台-待分配工单'
                    },
                    {
                        path: '/worktaskmanagement/newdistribution',
                        component: './worktaskmanagement/newdistribution',
                        breadcrumb: '新分配工单',
                        title: '乐莎莎管理后台-新分配工单'
                    },
                    {
                        path: '/worktaskmanagement/createclue',
                        component: './worktaskmanagement/createclue',
                        breadcrumb: '创建线索',
                        title: '乐莎莎管理后台-创建线索'
                    },
                    {
                        path: '/worktaskmanagement/waitfollowup',
                        component: './worktaskmanagement/waitfollowup',
                        breadcrumb: '待跟进工单',
                        title: '乐莎莎管理后台-待跟进工单'
                    },
                    {
                        path: '/worktaskmanagement/alreadyreserved',
                        component: './worktaskmanagement/alreadyreserved',
                        breadcrumb: '已预约工单',
                        title: '乐莎莎管理后台-已预约工单'
                    },
                    {
                        path: '/worktaskmanagement/alreadyshop',
                        component: './worktaskmanagement/alreadyshop',
                        breadcrumb: '已到店工单',
                        title: '乐莎莎管理后台-已到店工单'
                    },
                    {
                        path: '/worktaskmanagement/alreadydeal',
                        component: './worktaskmanagement/alreadydeal',
                        breadcrumb: '已成交工单',
                        title: '乐莎莎管理后台-已成交工单'
                    },
                    {
                        path: '/worktaskmanagement/alreadyclose',
                        component: './worktaskmanagement/alreadyclose',
                        breadcrumb: '已关闭工单',
                        title: '乐莎莎管理后台-已关闭工单'
                    },
                    {
                        path: '/worktaskmanagement/worktaskdetail',
                        component: './worktaskmanagement/worktaskdetail',
                        breadcrumb: '工单详情',
                        title: '乐莎莎管理后台-工单详情'
                    },
                    {
                        path: '/worktaskmanagement/handleworktask',
                        component: './worktaskmanagement/handleworktask',
                        breadcrumb: '处理工单',
                        title: '乐莎莎管理后台-处理工单'
                    },
                    {
                        path: '/worktaskmanagement/resultpage',
                        component: './worktaskmanagement/resultpage',
                        breadcrumb: '处理结果',
                        title: '乐莎莎管理后台-处理结果'
                    },
                    {
                        path: '/worktaskmanagement/cluelibrary',
                        component: './worktaskmanagement/cluelibrary',
                        breadcrumb: '线索库',
                        title: '乐莎莎管理后台-线索库'
                    },
                    {
                        path: '/worktaskmanagement/alreadydisclue',
                        component: './worktaskmanagement/alreadydisclue',
                        breadcrumb: '已分派线索',
                        title: '乐莎莎管理后台-已分派线索'
                    },
                    {
                        path: '/worktaskmanagement/callrecord',
                        component: './worktaskmanagement/callrecord',
                        breadcrumb: '(外)呼叫记录',
                        title: '乐莎莎管理后台-(外)呼叫记录'
                    },
                    {
                        path: '/worktaskmanagement/berecycled',
                        component: './worktaskmanagement/berecycled',
                        breadcrumb: '回收列表',
                        title: '乐莎莎管理后台-回收列表'
                    },
                    {
                        path: '/worktaskmanagement/missedcalls',
                        component: './worktaskmanagement/missedcalls',
                        breadcrumb: '未接来电记录',
                        title: '乐莎莎管理后台-未接来电记录'
                    },
                    {
                        path: '/worktaskmanagement/returnvisit',
                        component: './worktaskmanagement/returnvisit',
                        breadcrumb: '待回访列表',
                        title: '乐莎莎管理后台-待回访列表'
                    },
                ]
            },
            {
                path: '/operatemanagement',
                breadcrumb: '运营管理',
                routes: [
                    {
                        path: '/operatemanagement/carouselfigure',
                        component: './operatemanagement/carouselfigure',
                        breadcrumb: '轮播图',
                        title: '乐莎莎管理后台-轮播图'
                    },
                    {
                        path: '/operatemanagement/activemanagement',
                        component: './operatemanagement/activemanagement',
                        breadcrumb: '活动管理',
                        title: '乐莎莎管理后台-活动管理'
                    },
                    {
                        path: '/operatemanagement/articlemanagement',
                        component: './operatemanagement/articlemanagement',
                        breadcrumb: '文章管理',
                        title: '乐莎莎管理后台-文章管理'
                    },
                    {
                        path: '/operatemanagement/newsinformation',
                        component: './operatemanagement/newsinformation',
                        breadcrumb: '新闻动态',
                        title: '乐莎莎管理后台-新闻动态'
                    },
                    {
                        path: '/operatemanagement/OralAn',
                        component: './operatemanagement/OralAn',
                        breadcrumb: '口腔百科',
                        title: '乐莎莎管理后台-口腔百科'
                    }
                ]
            },
            {
                path: '/promanagement',
                breadcrumb: '产品管理',
                routes: [
                    {
                        path: '/promanagement/proinfo',
                        component: './promanagement/proinfo',
                        breadcrumb: '产品信息',
                        title: '乐莎莎管理后台-产品信息'
                    }
                ]
            },
            {
                path: '/ordermanagement',
                breadcrumb: '订单管理',
                routes: [
                    {
                        path: '/ordermanagement/orderlist',
                        component: './ordermanagement/orderlist',
                        breadcrumb: '订单列表',
                        title: '乐莎莎管理后台-订单列表'
                    },
                    {
                        path: '/ordermanagement/orderdetail',
                        component: './ordermanagement/orderdetail',
                        breadcrumb: '订单详情',
                        title: '乐莎莎管理后台-订单详情'
                    }
                ]
            },
            {
                path: '/reportmanagement',
                breadcrumb: '报表管理',
                routes: [
                    {
                        path: '/reportmanagement/dealstatistics',
                        component: './reportmanagement/dealstatistics',
                        breadcrumb: '成交统计',
                        title: '乐莎莎管理后台-成交统计'
                    },
                    {
                        path: '/reportmanagement/itustatistics',
                        component: './reportmanagement/itustatistics',
                        breadcrumb: '电联统计',
                        title: '乐莎莎管理后台-电联统计'
                    },

                ]
            },
            {
                path: '/login',
                component: './login',
                title: '乐莎莎管理后台-用户登录'
            }
        ]
    }
]
