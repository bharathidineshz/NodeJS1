// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import * as React from 'react'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import {
  Autocomplete,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Menu,
  Radio,
  RadioGroup,
  StepContent,
  Switch
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

/** store actions */
import {
  setClient,
  setCategory,
  setTasks,
  setProject,
  fetchClients,
  fetchUsers,
  setAssignees,
  postProject,
  postUser,
  postCategory,
  postTask,
  fetchCategories
} from 'src/store/apps/projects'
import { Stack } from '@mui/system'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter } from 'next/router'
import UserTable from './UserTable' // Import the UserTable component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ReactDatePicker from 'react-datepicker'
import Files from '../details/files'
import clsx from 'clsx'
import CustomPeoplePicker from 'src/views/components/autocomplete/CustomPeoplePicker'

const steps = [
  {
    title: 'Client',
    subtitle: 'Select Client'
  },
  {
    title: 'Projects',
    subtitle: 'Enter Project Details '
  },

  // {
  //   title: 'Task category',
  //   subtitle: 'Enter Task Category'
  // },
  // {
  //   title: 'Tasks',
  //   subtitle: 'Enter Tasks'
  // },
  {
    title: 'Assignees',
    subtitle: 'Select Users'
  }
]

const defaultClientValues = {
  client: '',
  clients: []
}

const defaultProjectValues = {
  name: '',
  plannedBudget: '',
  plannedHours: null
}

const defaultCategoryValues = {
  name: '',
  isBillable: true
}

const defaultTaskValues = {
  name: '',
  category: '',
  hours: ''
}

const defaultAssigneeValues = []

const clientSchema = yup.object().shape({
  client: yup.string().required()
})

const projectSchema = yup.object().shape({
  name: yup.string().required(),
  plannedBudget: yup.number().positive().integer(),
  plannedHours: yup.number().positive().integer()
})

const categorySchema = yup.object().shape({
  name: yup.string().required(),
  isBillable: yup.boolean()
})

const taskSchema = yup.object().shape({
  name: yup.string().required(),
  category: yup.string().required(),
  hours: yup.number().required(),
  isBillable: yup.boolean()
})

const assigneeSchema = yup.object().shape({})

const ProjectsStepper = ({ isEdit, id }) => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)

  const [state, setState] = useState({
    projectType: 2
  })

  const [createdProjectId, setcreatedProjectId] = useState('')

  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const router = useRouter()

  const [selectedUsers, setSelectedUsers] = useState([])
  const [managerAssignments, setManagerAssignments] = useState([])

  // ** Hooks

  useEffect(() => {
    dispatch(fetchClients())
    dispatch(fetchUsers())
  }, [dispatch])

  const {
    reset: clientReset,
    control: clientControl,
    watch: clientWatch,
    handleSubmit: handleClientSubmit,
    formState: { errors: clientErrors }
  } = useForm({
    defaultValues: defaultClientValues,
    resolver: yupResolver(clientSchema)
  })

  const [requiredskill, setRequiredskill] = React.useState([])

  const handleChange = event => {
    setRequiredskill(event.target.value)
  }

  const {
    reset: projectReset,
    control: projectControl,
    watch: projectWatch,
    handleSubmit: handleProjectSubmit,
    formState: { errors: projectErrors }
  } = useForm({
    defaultValues: defaultProjectValues,
    resolver: yupResolver(projectSchema)
  })

  const {
    reset: categoryReset,
    control: categoryControl,
    watch: categoryWatch,
    handleSubmit: handleCategorySubmit,
    formState: { errors: categoryErrors }
  } = useForm({
    defaultValues: defaultCategoryValues,
    resolver: yupResolver(categorySchema)
  })

  const {
    reset: taskReset,
    control: taskControl,
    watch: taskWatch,
    handleSubmit: handleTaskSubmit,
    formState: { errors: taskErrors }
  } = useForm({
    defaultValues: defaultTaskValues,
    resolver: yupResolver(taskSchema)
  })

  const {
    reset: assigneeRest,
    control: assigneeControl,
    watch: assigneeWatch,
    handleSubmit: handleAssigneeSubmit,
    formState: { errors: assigneeErrors }
  } = useForm({
    defaultValues: defaultAssigneeValues,
    resolver: yupResolver(assigneeSchema)
  })

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    clientReset({ client: '' })
    projectReset({
      name: '',
      plannedBudget: '',
      plannedHours: '',
      isBillable: false,
      allowOpenTasks: false
    })
    categoryReset([{ index: 0, name: '', isBIllable: false }])
    taskReset([{ index: 0, name: '', category: '', hours: '' }])
    assigneeReset([])
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      // toast.success('Form Submitted')
    }
  }

  const handleProjectType = e => {
    setState(state => ({ ...state, projectType: e.target.value }))

    dispatch(setProject({ projectType: e.target.value }))
  }

  const onSaveAssignee = () => {
    // console.log(taskWatch())
    assignUsers()
  }

  const onChangeCategoryOrTaskName = (e, index, name) => {
    switch (name?.toLowerCase()) {
      case 'category':
        var category = [...store.category]
        category[index] = {
          index: index,
          name: e.target.value,
          isBillable: category[index].isBillable
        }
        dispatch(setCategory(category))
        break
      case 'task':
        var tasks = [...store.tasks]
        tasks[index] = {
          index: index,
          name: e.target.value,
          hours: tasks[index].hours,
          category: tasks[index].category
        }
        dispatch(setTasks(tasks))
        break

      default:
        break
    }
  }

  const onChangeTasks = (index, e, name) => {
    var tasks = [...store.tasks]
    switch (name?.toLowerCase()) {
      case 'category':
        tasks[index] = {
          index: index,
          name: tasks[index].name,
          category: e.target.value,
          hours: tasks[index].hours
        }
        break
      case 'hours':
        tasks[index] = {
          index: index,
          name: tasks[index].name,
          category: tasks[index].category,
          hours: e.target.value
        }
        break
      default:
        break
    }
    dispatch(setTasks(tasks))
  }

  // const onChangeAssignees = (params, assignees) => {
  //   dispatch(setAssignees(assignees))
  // }

  const onChangeAssignees = (event, newValue) => {
    dispatch(setAssignees(newValue))
  }

  const addCategoryOrTask = name => {
    switch (name?.toLowerCase()) {
      case 'category':
        const categories = [
          ...store.category,
          { index: store.category?.length + 1, name: '', isBillable: false }
        ]
        dispatch(setCategory(categories))
        break
      case 'task':
        const tasks = [
          ...store.tasks,
          {
            index: store.tasks?.length + 1,
            name: '',
            category: '',
            hours: ''
          }
        ]
        dispatch(setTasks(tasks))
        break

      default:
        break
    }
  }

  const onRemoveCategoryorTask = (index, name) => {
    switch (name?.toLowerCase()) {
      case 'category':
        const categories = [...store.category]
        var _category = []
        categories.forEach((element, i) => {
          if (i !== index)
            _category.push({ index: i, name: element.name, isBillable: element.isBillable })
        })
        dispatch(setCategory(_category))
        break
      case 'task':
        const tasks = [...store.tasks]
        var _tasks = []
        tasks.forEach((element, i) => {
          if (i !== index)
            _tasks.push({
              index: i,
              name: element.name,
              category: element.category,
              hours: element.hours
            })
        })
        dispatch(setTasks(_tasks))
        break

      default:
        break
    }
  }

  const handleIsBillable = (e, index, name) => {
    switch (name?.toLowerCase()) {
      case 'project':
        const project = {
          projectType: state.projectType,
          projectName: projectWatch('name'),
          plannedBudget: projectWatch('plannedBudget'),
          plannedHours: projectWatch('plannedHours'),
          isBillable: e.target.checked,
          allowOpenTasks: false
        }
        dispatch(setProject(project))
        break

      case 'category':
        var c = [...store.category]
        c[index] = { index: index, name: c[index].name, isBillable: e.target.checked }
        dispatch(setCategory(c))
        break
      case 'task':
        var task = [...store.tasks]
        task[index] = { index: index, name: task[index].name, isBillable: e.target.checked }
        dispatch(setTasks(task))
        break

      default:
        break
    }
  }

  const handleSkip = () => {
    onSubmit()
  }

  const onClearCategoryOrTask = name => {
    switch (name?.toLowerCase()) {
      case 'category':
        dispatch(setCategory([]))
        break
      case 'task':
        dispatch(setTasks([{ index: 0, name: '', category: '', hours: '' }]))
        break

      default:
        break
    }
  }

  //CLIENT
  const onSaveClient = () => {
    console.log(clientWatch('client'))
    clientWatch('client') && dispatch(setClient(clientWatch('client')))
    onSubmit()
  }

  // PROEJCT
  const onSaveProject = values => {
    // const project = {
    //   projectType: state.projectType,
    //   projectName: projectWatch('name'),
    //   plannedBudget: projectWatch('plannedBudget'),
    //   plannedHours: projectWatch('plannedHours'),
    //   isBillable: store.project.isBillable,
    //   allowOpenTasks: false
    // }
    // dispatch(setProject(project))
    // createProject(project)
    onSubmit()
  }

  //CATEGORY
  const onSaveCategory = async () => {
    console.log(store.project.uniqueId)

    const request = {
      projectUid: createdProjectId,
      taskCategory: store.category.map(c => ({
        name: c.name,
        isBillable: c.isBillable
      }))
    }

    // dispatch(postCategory({ request: request, afterSubmit: onSubmit }))
    dispatch(postCategory(request))
      .then(unwrapResult)
      .then(() => {
        toast.success('Task Category Created', { position: 'top-right', duration: 3000 })
        onSubmit()
      })
      .catch(error => {
        toast.error(error.message, { position: 'top-right', duration: 3000 })
      })
  }

  //TASKS
  const onSaveTasks = async () => {
    dispatch(fetchCategories(createdProjectId))
      .then(unwrapResult)
      .then(response => {
        const request = {
          projectUid: store.project.uniqueId,
          taskRequest: store.tasks.map(task => {
            const category = response.find(c => c.name.trim() === task.category.trim())

            return {
              taskCategoryUid: category?.uniqueId,
              description: task.name,
              hours: task.hours,
              dateTime: new Date().toISOString()
            }
          })
        }

        dispatch(postTask(request))
          .then(unwrapResult)
          .then(() => {
            toast.success('Tasks Created', { position: 'top-right', duration: 3000 })
            onSubmit()
          })
          .catch(error => {
            toast.error(error.message, { position: 'top-right', duration: 3000 })
          })
      })
  }

  //CREATE PROJECT
  const createProject = project => {
    const { name, plannedBudget, plannedHours } = projectWatch()
    console.log(project)

    const request = {
      name: name,
      budget: plannedBudget?.trim(),
      projectType: state.projectType,
      hours: plannedHours,
      client: clientWatch('client'),
      isBillable: store.project.isBillable,
      isUndifinedTasksAllowed: false
    }

    dispatch(postProject(request))
      .then(unwrapResult)
      .then(response => {
        setcreatedProjectId(
          response.data === 'Project already exists' ? createdProjectId : response.data
        )
        toast.success('Project Created', { position: 'top-right', duration: 3000 })
        onSubmit()
      })
      .catch(error => {
        toast.error(error.message, { position: 'top-right', duration: 3000 })
      })
  }

  const assignUsers = () => {
    const request = {
      project_id: createdProjectId,
      mapping: managerAssignments.map(x => ({
        email: x?.email,
        cost: x?.allocatedProjectCost,
        projectRoleId: x?.projectRoleId
      }))
    }
    dispatch(postUser(request))
      .then(unwrapResult)
      .then(response => {
        setcreatedProjectId('')
        toast.success('Users Assigned', { position: 'top-right', duration: 3000 })
        toast.success('All Steps Completed', { position: 'top-right', duration: 4000 })
        router.push('/projects/list')
      })
      .catch(error => {
        toast.error(error.message, { position: 'top-right', duration: 3000 })
      })
  }

  console.log(store.users)

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleClientSubmit(onSaveClient)}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='client'
                    control={clientControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <Autocomplete
                        options={[
                          { uniqueId: '1', name: 'Telerad' },
                          { uniqueId: '2', name: 'Sipa Systems' }
                        ]}
                        id='autocomplete-limit-tags'
                        getOptionLabel={option => option.name || ''}
                        renderInput={params => (
                          <TextField {...params} label='Clients' placeholder='Clients' />
                        )}
                      />
                    )}
                  />
                  {clientErrors.client && (
                    <FormHelperText
                      sx={{ color: 'error.main' }}
                      id='stepper-linear-personal-country-helper'
                    >
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        return (
          <form key={1} onSubmit={handleProjectSubmit(onSaveProject)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Grid className='d-flex'>
                  <RadioGroup
                    row
                    aria-label='controlled'
                    name='controlled'
                    value={store.project.projectType}
                    onChange={handleProjectType}
                    defaultChecked={2}
                  >
                    <FormControlLabel value={2} control={<Radio />} label='Fixed Price' />
                    <FormControlLabel value={1} control={<Radio />} label='T & M' />
                  </RadioGroup>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='name'
                    control={projectControl}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label='Project Name'
                        onChange={onChange}
                        placeholder='Enter Project Name'
                        error={Boolean(projectErrors.name)}
                        aria-describedby='stepper-linear-project-name'
                      />
                    )}
                  />
                  {projectErrors.name && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-project-name'>
                      This field is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='plannedBudget'
                    control={projectControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='number'
                        value={value}
                        label='Planned Budget'
                        onChange={onChange}
                        placeholder='Enter Budget'
                        aria-describedby='stepper-linear-project-budget'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name='plannedHours'
                    control={projectControl}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='number'
                        value={value}
                        label='Planned Hours'
                        onChange={onChange}
                        placeholder='Enter Hours'
                        aria-describedby='stepper-linear-project-hours'
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={['React', 'SQL', 'Asp.Net']}
                    id='autocomplete-limit-tags'
                    getOptionLabel={option => option || ''}
                    renderInput={params => (
                      <TextField {...params} label='Department' placeholder='Department' />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <DatePickerWrapper>
                    <ReactDatePicker
                      id='picker-filter-to-date'
                      selected={new Date()}
                      popperPlacement='auto'
                      onChange={() => {}}
                      customInput={
                        <CustomInput
                          label='Start Date'
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Icon icon='mdi:calendar-outline' />
                              </InputAdornment>
                            )
                          }}
                        />
                      }
                    />
                  </DatePickerWrapper>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <DatePickerWrapper>
                    <ReactDatePicker
                      id='picker-filter-to-date'
                      selected={new Date()}
                      popperPlacement='auto'
                      onChange={() => {}}
                      customInput={
                        <CustomInput
                          label='Due Date'
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Icon icon='mdi:calendar-outline' />
                              </InputAdornment>
                            )
                          }}
                        />
                      }
                    />
                  </DatePickerWrapper>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    multiple
                    limitTags={3}
                    options={['React', 'SQL', 'Asp.Net', 'Flutter', 'Figma', 'Angular']}
                    id='autocomplete-limit-tags'
                    getOptionLabel={option => option || ''}
                    renderInput={params => (
                      <TextField {...params} label='Skills' placeholder='Skills' />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    value={store.project.isBillable}
                    onChange={event => {
                      handleIsBillable(event, 0, 'project')
                    }}
                    label='Billable'
                    id='stepper-linear-project-isBillable'
                  />
                </FormControl>
              </Grid>
            </Grid>
          </form>
        )

      case 2:
        return (
          <form key={2} onSubmit={handleAssigneeSubmit(onSaveAssignee)}>
            <Grid container spacing={5}>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Box>
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {steps[2].title}
                  </Typography>
                  <Typography variant='caption' component='p'>
                    {steps[2].subtitle}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Stack direction={'column'} spacing={5} sx={{ minWidth: 500 }}>
                  <Autocomplete
                    multiple
                    fullWidth
                    limitTags={3}
                    options={
                      store.users.map(item => ({
                        email: item.email,
                        userName: `${item.firstName} ${item.lastName}`,
                        allocatedProjectCost: '',
                        projectRoleId: 0
                      })) ?? []
                    }
                    id='autocomplete-limit-tags'
                    filterSelectedOptions
                    getOptionLabel={option => option.userName}
                    defaultValue={[] || null}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Users'
                        placeholder='Assignees'
                        sx={{ width: '40%' }}
                      />
                    )}
                    onChange={onChangeAssignees}
                  />
                  <UserTable
                    selectedUsers={store.assignees}
                    setManagerAssignments={setManagerAssignments}
                    managerAssignments={managerAssignments}
                  />
                </Stack>
                {/* Render the UserTable component passing the selected users */}
              </Grid>
            </Grid>
          </form>
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='large' variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <CardHeader title='Create New Project' />
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep} orientation='vertical'>
            {steps.map((step, index) => {
              return (
                <Step key={index} className={clsx({ active: activeStep === index })}>
                  <StepLabel StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                  <StepContent>
                    <Grid xs={12}>{renderContent()}</Grid>
                    <div className='button-wrapper'>
                      <Button
                        size='small'
                        color='secondary'
                        variant='outlined'
                        onClick={handleBack}
                        disabled={activeStep === 0}
                      >
                        Back
                      </Button>
                      <Button size='small' variant='contained' onClick={handleNext} sx={{ ml: 4 }}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
        {activeStep === steps.length && (
          <Box sx={{ mt: 2 }}>
            <Typography>All steps are completed!</Typography>
            <Button size='small' sx={{ mt: 2 }} variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ProjectsStepper
