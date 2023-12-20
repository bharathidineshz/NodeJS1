// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'

// ** Third Party Imports

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { FormControlLabel, FormHelperText, Radio, RadioGroup, Switch } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import CustomSkillPicker from 'src/views/components/autocomplete/CustomSkillPicker'
import { ORG_UNITS, SKILLS } from 'src/helpers/constants'
import { fetchSkills } from 'src/store/apps/user'

const Settings = () => {
  // ** States
  const [date, setDate] = useState(null)
  const [language, setLanguage] = useState([])

  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)
  const leaveStore = useSelector(state => state.leaveManagement)

  const [values, setValues] = useState({
    password: '',
    password2: '',
    showPassword: false,
    showPassword2: false
  })

  useEffect(() => {
    dispatch(fetchSkills())
  }, [])

  const handleProjectType = e => {
    dispatch(setProject({ projectType: e.target.value }))
  }

  const onSaveProject = async e => {
    e.preventDefault()

    const { uniqueId, name, budget, hours, isBillable, projectTypeId, clientId } = store.editProject
    const clientUId = store.allClients.find(o => o.id === clientId).uniqueId

    const request = {
      id: uniqueId,
      name: name,
      budget: budget,
      projectType: projectTypeId,
      hours: hours,
      clientUid: clientUId,
      isBillable: isBillable,
      isUndifinedTasksAllowed: false
    }
    dispatch(putProject({ request: request, afterSubmit: onSubmit }))
  }

  const onSaveCategory = e => {
    e.preventDefault()

    const { uniqueId, name, budget, hours, isBillable, projectTypeId, clientId, taskCategory } =
      store.editProject

    const request = {
      projectUId: uniqueId,
      taskCategory: taskCategory.map(category => ({
        name: category.name,
        taskCategoryUid: category.uniqueId,
        isBillable: category.isBillable
      }))
    }

    dispatch(putCategory({ request: request, afterSubmit: onSubmit }))
  }

  const onSaveTasks = e => {
    e.preventDefault()

    const { uniqueId, name, budget, hours, isBillable, projectTypeId, clientId, taskCategory } =
      store.editProject

    const request = {
      projectUid: uniqueId,
      taskResponse: taskCategory
        .flatMap(o => o.tasks)
        .map(t => ({
          taskUid: t.uniqueId,
          taskCategoryUid: t.taskCategoryId,
          description: t.description,
          hours: t.hours,
          dateTime: new Date().toISOString()
        }))
    }

    dispatch(putTask({ request: request, afterSubmit: onSubmit }))
  }

  const onSaveAssignee = async e => {
    e.preventDefault()

    const { uniqueId } = store.editProject

    const request = {
      project_id: uniqueId,
      mapping: managerAssignments.map(user => ({
        email: user.email,
        cost: user.allocatedProjectCost,
        projectRoleId: user.projectRoleId
      }))
    }
    dispatch(setEditProject({ ...store.editProject, assignee: managerAssignments }))
    dispatch(putProjectMap(request))
      .then(unwrapResult)
      .then(response => {
        toast.success('Assignees Updated', { duration: 3000, position: 'top-right' })
        setAssignees([])
        router.replace('/projects/list')
      })
      .catch(e => toast.error(error, { duration: 3000, position: 'top-right' }))
  }

  const onChangeCategoryOrTaskName = (e, index, name) => {
    var project = store.editProject
    var category = [...store.editProject.taskCategory]
    var tasks = [...store.editProject.taskCategory.flatMap(o => o.tasks)]

    switch (name?.toLowerCase()) {
      case 'category':
        category[index] = { ...category[index], name: e.target.value }
        dispatch(setEditProject({ ...store.editProject, taskCategory: category }))
        break
      case 'task':
        tasks[index] = {
          index: index,
          name: e.target.value,
          hours: tasks[index].hours,
          category: tasks[index].taskCategoryId
        }

        dispatch(setTasks(tasks))
        project = { ...project, taskCategory: category }
        dispatch(setEditProject(project))
        break

      default:
        break
    }
  }

  const onChangeTasks = (index, e, name) => {
    var project = store.editProject
    var categories = [...project.taskCategory]
    var tasks = [...categories.flatMap(o => o.tasks)]
    switch (name?.toLowerCase()) {
      case 'category':
        const category = categories.find(o => o.taskCategotyId === e.target.value)
        tasks[index] = { ...tasks, taskCategoryId: category.uniqueId }
        break
      case 'hours':
        tasks[index] = { ...tasks, hours: e.target.value.toString().trim() }

        break
      default:
        break
    }
    project = { ...project, taskCategory: categories }
    dispatch(setEditProject(project))
  }
  const [managerAssignments, setManagerAssignments] = useState([])

  const onChangeAssignees = (params, assignees) => {
    debugger
    console.log('assignees', assignees)
    dispatch(setAssignees(assignees))
  }

  const addCategoryOrTask = name => {
    switch (name?.toLowerCase()) {
      case 'category':
        const categories = [
          ...store.editProject.taskCategory,
          { index: store.editProject.taskCategory?.length + 1, name: '', isBillable: false }
        ]

        dispatch(setEditProject({ ...store.editProject, taskCategory: categories }))
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
        const categories = [...store.editProject.taskCategory]
        var _category = []
        categories.forEach((element, i) => {
          if (i !== index)
            _category.push({
              ...element,
              index: i,
              name: element.name,
              isBillable: element.isBillable
            })
        })
        dispatch(setEditProject({ ...store.editProject, taskCategory: _category }))
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
      case 'category':
        var c = [...store.editProject.taskCategory]
        c[index] = { index: index, name: c[index].name, isBillable: e.target.checked }
        dispatch(setEditProject({ ...store.editProject, taskCategory: c }))
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

  const onChnageClient = e => {
    var project = store.editProject
    const client = store.allClients.find(o => o.id === e.target.value)
    const editProject = { ...project, clientId: client.id, clientName: client.name }
    dispatch(setEditProject(editProject))
  }

  const onChangeProject = (name, value) => {
    var project = store.editProject
    switch (name) {
      case 'name':
        dispatch(setEditProject({ ...store.editProject, name: value }))
        break
      case 'budget':
        dispatch(setEditProject({ ...store.editProject, budget: isNaN(value) ? 0 : Number(value) }))
        break
      case 'hours':
        dispatch(setEditProject({ ...store.editProject, hours: isNaN(value) ? 0 : Number(value) }))
        break
      case 'isBillable':
        dispatch(setEditProject({ ...store.editProject, isBillable: value }))
        break
      case 'projectType':
        dispatch(setEditProject({ ...store.editProject, projectTypeId: value }))
        break

      default:
        break
    }
  }

  const [requiredskill, setRequiredskill] = useState([])

  const handleChange = event => {
    setRequiredskill(event.target.value)
  }

  return (
    <Card>
      <CardHeader
        title='Update project details'
        action={
          <Button type='reset' size='large' color='error' variant='contained'>
            Archive
          </Button>
        }
      />
      <Divider sx={{ m: '0 !important' }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Client Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='stepper-linear-client'>Client</InputLabel>
                <Select
                  fullWidth
                  value='Telerad'
                  label='Client'
                  labelId='stepper-linear-client'
                  aria-describedby='stepper-linear-client'
                >
                  {[
                    { uniqueId: '1', name: 'Telerad' },
                    { uniqueId: '2', name: 'Sipa Systems' }
                  ].map(client => (
                    <MenuItem key={client.uniqueId} value={client.uniqueId}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Project Details
              </Typography>
            </Grid>
            <Grid item xs={12} className='d-flex'>
              <RadioGroup
                row
                aria-label='controlled'
                name='controlled'
                value={store.editProject?.projectTypeId}
                onChange={e => onChangeProject('projectTypeId', e.target.value)}
              >
                <FormControlLabel
                  disabled
                  value={2}
                  defaultChecked
                  control={<Radio />}
                  label='Fixed Price'
                />
                <FormControlLabel disabled value={1} control={<Radio />} label='T & M' />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  value={store.editProject?.name ?? ''}
                  label='Project Name'
                  onChange={e => onChangeProject('name', e.target.value)}
                  placeholder='Enter Project Name'
                  error={Boolean(!store.editProject?.name)}
                  aria-describedby='stepper-linear-project-name'
                />
                {store.editProject?.name == '' && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-project-name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  value={store.editProject?.budget ?? ''}
                  label='Planned Budget'
                  type='number'
                  onChange={e => onChangeProject('budget', e.target.value)}
                  placeholder='Enter Budget'
                  error={Boolean(!store.editProject?.budget)}
                  aria-describedby='stepper-linear-project-budget'
                />
                {store.editProject?.budget == '' && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-project-budget'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  value={store.editProject?.hours}
                  label='Planned Hours'
                  onChange={e => onChangeProject('hours', e.target.value)}
                  placeholder='Enter Hours'
                  error={Boolean(!store.editProject?.hours)}
                  aria-describedby='stepper-linear-project-hours'
                />
                {store.editProject?.hours == '' && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-project-hours'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='file'
                label='Files'
                placeholder='Add Files'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:file-outline' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <DatePickerWrapper>
                  <DatePicker
                    id='picker-filter-to-date'
                    selected={new Date()}
                    popperPlacement='auto'
                    onChange={e => onChangeProject('hours', e.target.value)}
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
                  <DatePicker
                    id='picker-filter-to-date'
                    selected={new Date()}
                    popperPlacement='auto'
                    onChange={e => onChangeProject('hours', e.target.value)}
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
                <CustomSkillPicker values={[]} items={[]} label='Skills' />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <CustomSkillPicker items={ORG_UNITS} label='Department' />
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
        </CardContent>
        <Divider sx={{ m: '0 !important' }} />
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type='reset' size='large' color='secondary' variant='outlined'>
            Reset
          </Button>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            Submit
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default Settings
