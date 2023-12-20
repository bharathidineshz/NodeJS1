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
import { Avatar, Checkbox, Chip, Drawer, FormControl, FormControlLabel, FormHelperText, InputLabel, ListItemText, MenuItem, Radio, RadioGroup, Select, Switch, Typography } from '@mui/material'

//** Third Party */
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCategories, setEditTask, setEmpty, setMileStones, setNewTask, setTaskLists } from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

const NewMileStone = ({ isOpen, setOpen }) => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.projects);

  const [milestone, setMilestone] = useState({
    milestoneName: '',
    startDate: new Date(),
    endDate: new Date(),
    categories: []
  })

  const STATUS = ["Completed", "Not Started", "Working on it", "Due"]
  const STATUS_COLOR = ["success", "warning", "info", "error"]

  // const isWeekday = (date) => {
  //   const day = new Date(date).getDay()

  //   return day !== 0 && day !== 6
  // }

  //CREATE
  const CreateNewMileStone = () => {

    try {
      store.mileStones.length > 0 ? dispatch(setMileStones([...store.mileStones, milestone])) : dispatch(setMileStones([milestone]))
      setOpen(false)
      setMilestone({
        milestoneName: '',
        startDate: new Date(),
        endDate: new Date(),
        categories: []
      })
      toast.success(`M${store.mileStones.length + 1} Created`, { duration: 3000, position: "top-right" })
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
    } catch (error) {
      toast.error(error, { duration: 3000, position: "top-right" })
    }
  }

  //CLOSE

  const handleClose = () => {
    setOpen(false);
    setMilestone({
      milestoneName: '',
      startDate: new Date(),
      endDate: new Date(),
      categories: []
    })
  }

  // SET FIELDS

  const handleChange = (name) => (e) => {

    switch (name?.toLowerCase()) {
      case 'name':
        setMilestone({ ...milestone, milestoneName: e.target.value })
        break;
      case 'startdate':
        setMilestone({ ...milestone, startDate: e })
        break;
      case 'enddate':
        setMilestone({ ...milestone, endDate: e })
        break;
      case 'categories':
        setMilestone({ ...milestone, categories: e.target.value })
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
              <Typography color="secondary">{`Add Milestone (M${store.mileStoneLists?.length + 1})`}</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Milestone'
                value={milestone.milestoneName}
                placeholder='Milestone Name'
                onChange={handleChange("name")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:flag-triangle' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <DatePickerWrapper>
                <DatePicker
                  id='picker-filter-from-date'
                  selected={milestone.startDate}
                  popperPlacement="bottom"
                  onChange={handleChange("startDate")}
                  customInput={<CustomInput label='Start Date' fullWidth InputProps={{
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
              <DatePickerWrapper>
                <DatePicker
                  id='picker-filter-to-date'
                  selected={milestone.endDate}
                  popperPlacement="bottom"
                  onChange={handleChange("endDate")}
                  customInput={<CustomInput label='End Date' fullWidth InputProps={{
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
              <FormControl fullWidth>
                <InputLabel id='demo-multiple-checkbox-label'>Categories</InputLabel>
                <Select
                  multiple
                  label='Categories'
                  value={milestone.categories}
                  MenuProps={MenuProps}
                  onChange={handleChange("categories")}
                  id='demo-multiple-checkbox'
                  labelId='demo-multiple-checkbox-label'
                  renderValue={selected => selected.join(', ')}
                >
                  {store.categories.map(name => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={milestone.categories.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button size='large' variant='outlined' color="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button size='large' variant='contained' type="submit" onClick={CreateNewMileStone}>
                Add Milestone
              </Button>
            </Grid>
          </Grid>
        </form>
      </Drawer>


    </Box>
  )
}

export default NewMileStone
