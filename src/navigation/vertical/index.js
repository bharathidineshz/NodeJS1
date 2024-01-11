import { useEffect, useState } from 'react'

const VerticalNavItems = () => {
  const [role, setRole] = useState(0)
  useEffect(() => {
    const role = localStorage?.getItem('roleId')
    setRole(role)
  }, [])

  // return role == 1 || role == 2
  //   ? [
  //       {
  //         title: 'Timesheets',
  //         icon: 'mdi:clock-time-four-outline',
  //         auth: false,
  //         path: '/timesheets'
  //       },
  //       {
  //         title: 'Clients',
  //         icon: 'mdi:account-group-outline',
  //         auth: false,
  //         path: '/clients'
  //       },
  //       {
  //         title: 'Projects',
  //         icon: 'mdi:clipboard-text',
  //         auth: false,
  //         path: '/projects/list'
  //       },
  //       {
  //         title: 'Reports',
  //         icon: 'mdi:chart-line',

  //         // auth: false,
  //         children: [
  //           {
  //             title: 'Utilization',
  //             path: '/apps/reports',
  //             icon: 'solar:chart-linear'

  //             // auth: false
  //           },
  //           {
  //             title: 'Revenue',
  //             path: '/apps/financialReports',
  //             icon: 'material-symbols:finance-mode'

  //             // auth: false
  //           },
  //           {
  //             title: 'Time',
  //             path: '/apps/reports/time',
  //             icon: 'mdi:clock-time-seven-outline'

  //             // auth: false
  //           }
  //         ]
  //       },
  //       {
  //         title: 'Invoice',
  //         icon: 'mdi:file-document-outline',
  //         path: '/apps/invoice/list'
  //       },
  //       {
  //         title: 'User',
  //         icon: 'mdi:account-outline',
  //         auth: false,
  //         path: '/users'
  //       },

  //       {
  //         title: 'Absence',
  //         icon: 'mdi:calendar-alert-outline',
  //         path: '/absence-management/leaves',
  //         auth: false
  //       },

  //       {
  //         title: 'Settings',
  //         icon: 'mdi:file-document-outline',
  //         path: '/settings/Settings',
  //         auth: false
  //       }
  //     ]
  //   : [
  //       {
  //         title: 'Timesheets',
  //         icon: 'mdi:clock-time-four-outline',
  //         auth: false,
  //         path: '/timesheets'
  //       },
  //       {
  //         title: 'Absence',
  //         icon: 'mdi:calendar-alert-outline',
  //         path: '/absence-management/leaves',
  //         auth: false
  //       }
  //     ]

  //** -------------LEAVE MANAGEMENT ------------ */

  return role == 1 || role == 2 || role == 3
    ? [
        {
          title: 'User',
          icon: 'mdi:account-outline',
          auth: false,
          path: '/users'
        },

        {
          title: 'Absence',
          icon: 'mdi:calendar-alert-outline',
          path: '/absence-management/leaves',
          auth: false
        },

        {
          title: 'Settings',
          icon: 'mdi:file-document-outline',
          path: '/settings/Settings',
          auth: false
        }
      ]
    : [
        {
          title: 'Absence',
          icon: 'mdi:calendar-alert-outline',
          path: '/absence-management/leaves',
          auth: false
        }
      ]
}

export default VerticalNavItems
