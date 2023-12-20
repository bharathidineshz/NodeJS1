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
import Members from 'src/views/projects/details/members'
import Settings from 'src/views/projects/details/settings'
import TaskCategory from 'src/views/projects/details/task-category'
import MileStone from 'src/views/projects/details/milestone'
import Feedback from 'src/views/projects/details/feedback'
import ProjectHeader from 'src/views/projects/details/ProjectHeader'
import { Button } from '@mui/material'
import NewTaskCategory from 'src/views/projects/details/task-category/tasks/NewCategory'
import NewMileStone from './details/milestone/NewMileStone'
import { useDispatch, useSelector } from 'react-redux'
import NewMember from './details/members/NewMember'
import NewFeedback from './details/feedback/NewFeedback'
import Files from './details/files'
import Link from 'next/link'

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

const ProjectDetails = ({ tab, data }) => {
  // ** State
  const [activeTab, setActiveTab] = useState(tab)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)

  // ** Hooks
  const router = useRouter()
  const hideText = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `//projects/details/${value}`
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
    task: <TaskCategory />,
    milestone: <MileStone />,
    feedback: <Feedback data={store.feedbacks} />,
    members: <Members data={store.projectMembers} />,
    settings: <Settings />,
    files: <Files />
  }

  //SHOW DRAWER

  const showDrawer = name => () => {
    switch (name?.toLowerCase()) {
      case 'category':
        setOpen(true)
        break
      case 'milestone':
        setOpen(true)
        break
      case 'members':
        setOpen(true)
        break
      case 'feedback':
        setOpen(true)
        break

      default:
        break
    }
  }

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
                  <Tab
                    value='task'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(!hideText && { '& svg': { mr: 2 } })
                        }}
                      >
                        <Icon fontSize={20} icon='mdi:checkbox-marked-circle-auto-outline' />
                        {!hideText && 'Tasks'}
                      </Box>
                    }
                  />
                  <Tab
                    value='milestone'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(!hideText && { '& svg': { mr: 2 } })
                        }}
                      >
                        <Icon fontSize={20} icon='mdi:flag-triangle' />
                        {!hideText && 'Milestones'}
                      </Box>
                    }
                  />
                  <Tab
                    value='feedback'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(!hideText && { '& svg': { mr: 2 } })
                        }}
                      >
                        <Icon fontSize={20} icon='mdi:comment-quote-outline' />
                        {!hideText && 'Feedbacks'}
                      </Box>
                    }
                  />
                  <Tab
                    value='members'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(!hideText && { '& svg': { mr: 2 } })
                        }}
                      >
                        <Icon fontSize={20} icon='mdi:account-multiple-outline' />
                        {!hideText && 'Members'}
                      </Box>
                    }
                  />
                  <Tab
                    value='settings'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(!hideText && { '& svg': { mr: 2 } })
                        }}
                      >
                        <Icon fontSize={20} icon='mdi:cog-outline' />
                        {!hideText && 'Settings'}
                      </Box>
                    }
                  />
                  <Tab
                    value='files'
                    label={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          ...(!hideText && { '& svg': { mr: 2 } })
                        }}
                      >
                        <Icon fontSize={20} icon='mdi:file-outline' />
                        {!hideText && 'Files'}
                      </Box>
                    }
                  />
                </TabList>

                <Box display="flex" className="gap-1">
                  <Button variant="contained" color="secondary" component={Link} href="/projects/reports/0" startIcon={<Icon icon='mdi:chart-box' fontSize={20} />}>Reports</Button>
                  {
                    tab !== 'settings' && (
                      <Button
                        variant='contained'
                        startIcon={<Icon icon='mdi:add' fontSize={20} />}
                        onClick={showDrawer(tab === 'task' ? 'Category' : tab)}
                      >
                        Add {tab === 'task' ? 'Category' : tab}
                      </Button>
                    )
                  }
                </Box>


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
        </Grid>
      )}

      {tab === 'task' ? (
        <NewTaskCategory isOpen={isOpen} setOpen={setOpen} />
      ) : tab === 'milestone' ? (
        <NewMileStone isOpen={isOpen} setOpen={setOpen} />
      ) : tab === 'members' ? (
        <NewMember isOpen={isOpen} setOpen={setOpen} />
      ) : tab === 'feedback' ? (
        <NewFeedback isOpen={isOpen} setOpen={setOpen} />
      ) : (
        <></>
      )}
    </Grid>
  )
}

export default ProjectDetails
