import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import Typography from '@mui/material/Typography'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { Autocomplete, CircularProgress, FormHelperText, Grid, Tab } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import currencies from 'src/helpers/currencies.json'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled } from '@mui/material/styles'
import timezones from 'src/helpers/timezones.json'
import CustomSkillPicker from 'src/views/components/autocomplete/CustomSkillPicker'
import { fetchSkills, fetchUsers } from 'src/store/apps/user'
import { fetchConfig, addConfig, fetchHRApprovals } from 'src/store/settings'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import MuiTabList from '@mui/lab/TabList'
import Icon from 'src/@core/components/icon'
import SimpleBackdrop from 'src/@core/components/spinner'
import DepartmentConfig from 'src/views/configuration/department'
import SettingsConfig from 'src/views/configuration/settings'
import SkillsConfig from 'src/views/configuration/skills'
import { fetchRequiredSkills } from 'src/store/apps/projects'
import NewSkill from 'src/views/configuration/skills/NewSkill'

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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

const Configurations = ({ tab }) => {
  const [activeTab, setActiveTab] = useState('cofigurations')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)

  // ** Hooks
  const router = useRouter()
  const hideText = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const dispatch = useDispatch()

  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/settings/${value}`
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
      dispatch(fetchConfig())
      dispatch(fetchHRApprovals())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  useEffect(() => {
    dispatch(fetchConfig())
  }, [])

  const tabContentList = {
    Department: <DepartmentConfig />,
    Skills: <SkillsConfig />,
    Settings: <SettingsConfig />
  }

  const tabs = [
    { name: 'Department', icon: 'mdi:calendar-alert' },
    { name: 'Skills', icon: 'mdi:check-decagram' },
    { name: 'Settings', icon: 'mdi:chart-box' }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {activeTab ? (
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12} display='flex' justifyContent='space-between' alignItems='center'>
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
                          {!hideText && tab.name}
                        </Box>
                      }
                    />
                  ))}
                </TabList>

                {activeTab != 'Settings' && (
                  <Button variant='contained' onClick={() => setOpen(true)}>
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
                    <Grid xs={12}>{tabContentList[activeTab]}</Grid>
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        ) : (
          <SimpleBackdrop />
        )}
        <NewSkill isOpen={isOpen} setOpen={setOpen} />
      </Grid>
    </Grid>
  )
}

export default Configurations
