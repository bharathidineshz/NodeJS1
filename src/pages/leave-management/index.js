// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Components
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components
import Approval from 'src/views/leave-management/approval'
import LeaveApply from 'src/views/leave-management/apply'
import LeaveReports from 'src/views/leave-management/reports'
import LeavePolicy from 'src/views/leave-management/leave-policy'
import { Button } from '@mui/material'
import LeaveApplyForm from 'src/views/leave-management/apply/LeaveApplyForm'
import NewLeavePolicy from 'src/views/leave-management/leave-policy/NewLeavePolicy'
import AllRequests from 'src/views/leave-management/all-requests'
import LeaveSettings from 'src/views/leave-management/settings'

const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    borderBottom: `3px solid ${theme.palette.primary.main}`,
    color: `${theme.palette.primary.main} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),

    // borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    }
  }
}))

const LeaveManagement = ({ tab, data }) => {
  // ** State
  const [activeTab, setActiveTab] = useState('my leaves')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)

  // ** Hooks
  const router = useRouter()
  const hideText = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/leave-management/${value}`
      })
      .then(() => setIsLoading(false))
  }
  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const tabContentList = {
    'my leaves': <LeaveApply />,
    // 'all requests': <AllRequests />,
    approval: <Approval />,
    reports: <LeaveReports />,
    leave_policy: <LeavePolicy />,
    settings: <LeaveSettings />
  }

  const tabs = [
    { name: 'my leaves', icon: 'mdi:calendar-alert' },
    // { name: 'all requests', icon: 'mdi:calendar-outline' },
    { name: 'approval', icon: 'mdi:check-decagram' },
    { name: 'reports', icon: 'mdi:chart-box' },
    { name: 'leave_policy', icon: 'mdi:text-box-multiple-outline' },
    { name: 'settings', icon: 'mdi:gear-outline' }
  ]

  return (
    <Grid container spacing={6}>
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12} display='flex' justifyContent='space-between' alignItems='center'>
                {/* <Grid item>
                  <Typography variant='h5' fontWeight='600' color='primary'>
                    ADAT
                  </Typography>
                </Grid> */}
                <TabList
                  variant='scrollable'
                  scrollButtons='auto'
                  onChange={handleChange}
                  aria-label='basic tabs example'
                >
                  {tabs.map((tab, key) => (
                    <Tab
                      key={key}
                      value={tab.name}
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ...(!hideText && { '& svg': { mr: 2 } })
                          }}
                        >
                          <Icon fontSize={20} icon={tab.icon} />
                          {!hideText && (tab.name === 'leave_policy' ? 'leave policy' : tab.name)}
                        </Box>
                      }
                    />
                  ))}
                </TabList>
                {(activeTab === 'my leaves' || activeTab === 'leave_policy') && (
                  <Button
                    variant='contained'
                    startIcon={<Icon icon='mdi:add' fontSize={20} />}
                    onClick={() => setOpen(true)}
                  >
                    Add {activeTab}
                  </Button>
                )}
              </Grid>
              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
                {isLoading ? (
                  <Box
                    sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                  >
                    <CircularProgress sx={{ mb: 4 }} />
                    <Typography>Loading...</Typography>
                  </Box>
                ) : (
                  <TabPanel sx={{ p: 0 }} value={activeTab}>
                    {tab === 'files' ? (
                      <Grid xs={12}>{tabContentList[activeTab]}</Grid>
                    ) : (
                      tabContentList[activeTab]
                    )}
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
          {activeTab === 'my leaves' ? (
            <LeaveApplyForm isOpen={isOpen} setOpen={setOpen} />
          ) : (
            <NewLeavePolicy isOpen={isOpen} setOpen={setOpen} />
          )}
        </Grid>
      )}
    </Grid>
  )
}

export default LeaveManagement
