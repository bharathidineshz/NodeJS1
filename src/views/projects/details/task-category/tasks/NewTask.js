// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Avatar, Chip, Drawer, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, Typography } from '@mui/material'

//** Third Party */
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setEditTask, setNewTask, setTaskLists } from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'

const NewTask = ({ isOpen, setOpen }) => {

  const [assignees, setAssignees] = useState([{ name: "Babysha Papanasam" }, { name: "Dhineshkumar Selvam" }, { name: "Naveenkumar Mounsamy" }, { name: "Pavithra Murugesan" }, { name: "BabySha Papanasam" }])
  const STATUS = ["Completed", "Not Started", "Working on it", "Due"]
  const STATUS_COLOR = ["success", "warning", "info", "error"]

  const dispatch = useDispatch();
  const store = useSelector(state => state.projects);

  const [localNewTask, setLocalNewtask] =
    useState({
      task: '',
      owner: '',
      status: '',
      dueDate: new Date(),
      estimatedHours: '',
      file: '',
      isBillable: true
    })

  const EMPTY_TASK = {
    task: '',
    owner: {},
    status: '',
    dueDate: '',
    EstimatedHours: '',
    file: '',
    isBillable: true
  }

  useEffect(() => {
    Object.keys(store.editTask).length > 0 && setLocalNewtask(store.editTask)
  }, [store.editTask])

  // const isWeekday = (date) => {
  //   const day = new Date(date).getDay()

  //   return day !== 0 && day !== 6
  // }

  //CREATE
  const createNewTask = () => {

    try {
      const newtask = {
        id: store.taskLists.length + 1,
        ...localNewTask,
        dueDate: formatLocalDate(localNewTask.dueDate),
      }
      dispatch(setTaskLists([...store.taskLists, newtask]))
      setOpen(false)
      toast.success("Task Created", { duration: 3000, position: "top-right" })
      setLocalNewtask(EMPTY_TASK)
    } catch (error) {
      toast.error(error, { duration: 3000, position: "top-right" })
    }
  }

  //UPDATE
  const updateTask = () => {
    try {
      const tasks = [...store.taskLists];
      let index = tasks.findIndex(o => o.id === localNewTask.id)
      if (index != -1) tasks[index] = { ...localNewTask, dueDate: formatLocalDate(localNewTask.dueDate), }
      dispatch(setTaskLists(tasks))
      dispatch(setEditTask({}))
      setOpen(false)
      toast.success("Task Updated", { duration: 3000, position: "top-right" })
      setLocalNewtask(EMPTY_TASK)
    } catch (error) {
      toast.error(error, { duration: 3000, position: "top-right" })
    }
  }

  //NEW task
  const handleNewTaskDetails = (e, name) => {
    switch (name?.toLowerCase()) {
      case 'task':
        setLocalNewtask({ ...localNewTask, task: e.target.value })
        break;
      case 'assignee':
        setLocalNewtask({ ...localNewTask, owner: e.target.value })
        break;
      case 'status':
        setLocalNewtask({ ...localNewTask, status: e.target.value })
        break;
      case 'duedate':
        setLocalNewtask({ ...localNewTask, dueDate: e })
        break;
      case 'estimatedhours':
        setLocalNewtask({ ...localNewTask, estimatedHours: e.target.value })
        break;
      case 'isbillable':
        setLocalNewtask({ ...localNewTask, isBillable: e.target.checked })
        break;
      default:
        break;
    }

  }


  return (
    <Box >

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setOpen(false)}

      >
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5} sx={{ p: 8, width: 420 }}>

            <Grid item xs={12} className='gap-1' justifyContent="space-between" alignItems="center">
              <Typography color="secondary">Add New task</Typography>
              <CustomChip label={store.selectedCategory} skin='light' color='primary' />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Task'
                value={localNewTask.task}
                placeholder='Task Name'
                onChange={(e) => handleNewTaskDetails(e, 'task')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:checkbox-marked-circle-auto-outline' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-outlined-label'>Assignees</InputLabel>
                <Select
                  label='Assignees'
                  id='demo-simple-select-outlined'
                  labelId='demo-simple-select-outlined-label'
                  required
                  value={localNewTask.owner}
                  onChange={(e) => handleNewTaskDetails(e, 'assignee')}
                  startAdornment={<InputAdornment position='start'>
                    <Icon icon='mdi:account-alert-outline' />
                  </InputAdornment>}
                >
                  {
                    assignees.map((assignee, i) => (
                      <MenuItem key={i} className="gap-1" value={assignee.name}>{assignee.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-outlined-label'>Status</InputLabel>
                <Select
                  label='Status'
                  id='demo-simple-select-outlined'
                  labelId='demo-simple-select-outlined-label'
                  required
                  value={localNewTask.status}
                  onChange={(e) => handleNewTaskDetails(e, 'status')}
                  startAdornment={<InputAdornment position='start'>
                    <Icon icon='mdi:list-status' />
                  </InputAdornment>}
                >
                  {
                    STATUS.map((status, i) => (
                      <MenuItem key={i} className="gap-1" value={status}>   <CustomChip size='small' skin='light' color={STATUS_COLOR[i]} label={status} /></MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>



            <Grid item xs={12}>
              <DatePickerWrapper>
                <DatePicker
                  id='picker-filter-from-date'
                  selected={localNewTask.dueDate}
                  popperPlacement="bottom"
                  onChange={(e) => handleNewTaskDetails(e, 'dueDate')}
                  customInput={<CustomInput label='Due Date' fullWidth InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon='mdi:calendar-outline' />
                      </InputAdornment>
                    )
                  }} />}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                value={localNewTask.estimatedHours}
                onChange={(e) => handleNewTaskDetails(e, 'estimatedHours')}
                label='Estimated Hours'
                placeholder='Estimated Hours'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:clock-outline' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <FormControlLabel control={<Switch checked={localNewTask.isBillable} onChange={(e) => handleNewTaskDetails(e, 'isBillable')} />} label='Billable' />
            </Grid>


            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button size='large' variant='outlined' color="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
              {
                Object.keys(store.editTask).length > 0 ? <Button size='large' variant='contained' type="submit" onClick={updateTask}>
                  Update Task
                </Button> : <Button size='large' variant='contained' type="submit" onClick={createNewTask}>
                  Add Task
                </Button>
              }

            </Grid>
          </Grid>
        </form>
      </Drawer>


    </Box>
  )
}

export default NewTask
