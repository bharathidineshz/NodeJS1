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
import { setCategories, setEditTask, setEmpty, setNewTask, setTaskLists } from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'

const NewTaskCategory = ({ isOpen, setOpen }) => {

  const [assignees, setAssignees] = useState([{ name: "Babysha Papanasam" }, { name: "Dhineshkumar Selvam" }, { name: "Naveenkumar Mounsamy" }, { name: "Pavithra Murugesan" }, { name: "BabySha Papanasam" }])
  const [categoryName, setCategoryName] = useState('')
  const dispatch = useDispatch();
  const store = useSelector(state => state.projects);

  const STATUS = ["Completed", "Not Started", "Working on it", "Due"]
  const STATUS_COLOR = ["success", "warning", "info", "error"]

  // const isWeekday = (date) => {
  //   const day = new Date(date).getDay()

  //   return day !== 0 && day !== 6
  // }

  //CREATE
  const createNewCategory = () => {

    try {
      store.categories.length > 0 ? dispatch(setCategories([categoryName, ...store.categories])) : dispatch(setCategories([categoryName]))
      dispatch(setEmpty(false))
      setOpen(false)
      toast.success("Task Category Created", { duration: 3000, position: "top-right" })
      setCategoryName('')
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
              <Typography color="secondary">Add New Category</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Category'
                value={categoryName}
                placeholder='Category Name'
                onChange={(e) => setCategoryName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='mdi:shape-outline' />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button size='large' variant='outlined' color="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button size='large' variant='contained' type="submit" onClick={createNewCategory}>
                Add category
              </Button>
            </Grid>
          </Grid>
        </form>
      </Drawer>


    </Box>
  )
}

export default NewTaskCategory
