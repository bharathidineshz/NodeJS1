// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectMembers } from 'src/store/apps/projects'
import { useEffect } from 'react'
import EmptyMembers from './EmptyMembers'

const COLORS = ['primary', 'secondary', 'info', 'warning', 'error', 'grey']

const Members = ({ data }) => {
  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)

  useEffect(() => {
    dispatch(fetchProjectMembers(Number(localStorage.getItem('projectId'))))
  }, [])

  return (
    <>
      {store?.projectMembers != null && store?.projectMembers?.length > 0 ? (
        <Grid container spacing={6}>
          {store?.projectMembers.length > 0 &&
            store.projectMembers.map((item, index) => {
              return (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Card sx={{ position: 'relative' }}>
                    <OptionsMenu
                      iconButtonProps={{
                        size: 'small',
                        sx: { top: 12, right: 12, position: 'absolute' }
                      }}
                      options={[
                        'Block',
                        'Share Profile',
                        { divider: true },
                        { text: 'Remove', menuItemProps: { sx: { color: 'error.main' } } }
                      ]}
                    />
                    <CardContent>
                      <Box
                        sx={{
                          mt: 2,
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column'
                        }}
                      >
                        <Avatar
                          src={`/images/avatars/${index + 1}.png`}
                          sx={{ mb: 6, width: 80, height: 80 }}
                        />
                        <Typography variant='h6'>{item.userName}</Typography>
                        <Typography sx={{ mb: 6, color: 'text.secondary' }}>{item.role}</Typography>
                        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                          {item.userSkills &&
                            item.userSkills.map((skill, i) => (
                              <Box
                                key={index}
                                onClick={e => e.preventDefault()}
                                sx={{
                                  textDecoration: 'none',
                                  '&:not(:last-of-type)': { mr: 4 },
                                  '& .MuiChip-root': { cursor: 'pointer' }
                                }}
                              >
                                {skill && (
                                  <CustomChip
                                    size='small'
                                    skin='light'
                                    color={COLORS[i]}
                                    label={skill || ''}
                                  />
                                )}
                              </Box>
                            ))}
                        </Box>
                        <Box
                          sx={{
                            mb: 6,
                            gap: 2,
                            width: '100%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                          }}
                        >
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                          >
                            <Typography variant='h5'>{item?.feedbacks || 0}</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>Feedbacks</Typography>
                          </Box>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                          >
                            <Typography variant='h5'>{item.taskCount}</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>Tasks</Typography>
                          </Box>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
                          >
                            <Typography variant='h5'>{item.utilization + '%'}</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>Utilizations</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Button
                            variant='outlined'
                            color='secondary'
                            sx={{ p: 1.5, minWidth: 38 }}
                          >
                            <Icon icon='mdi:email-outline' />
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
        </Grid>
      ) : (
        <EmptyMembers />
      )}
    </>
  )
}

export default Members
