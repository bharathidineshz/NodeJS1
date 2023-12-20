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
import { Autocomplete, Avatar, Checkbox, Chip, Drawer, FormControl, FormControlLabel, FormHelperText, InputLabel, ListItemText, MenuItem, Radio, RadioGroup, Select, Switch, Typography } from '@mui/material'

//** Third Party */
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCategories, setEditTask, setEmpty, setNewTask, setProjectMembers, setTaskLists } from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'
import CustomPeoplePicker from 'src/views/components/autocomplete/CustomPeoplePicker'

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

const NewMember = ({ isOpen, setOpen }) => {
  const [assignees, setAssignees] = useState()
  const [members, setMembers] = useState([{ name: "Babysha Papanasam" }, { name: "Dhineshkumar Selvam" }, { name: "Naveenkumar Mounsamy" }, { name: "Pavithra Murugesan" }])
  const [projectMem, setProjectMem] = useState([])

  const dispatch = useDispatch();
  const store = useSelector(state => state.projects);

  const STATUS = ["Completed", "Not Started", "Working on it", "Due"]
  const STATUS_COLOR = ["success", "warning", "info", "error"]


  const onSelectMember = (e) => {
    setProjectMem(e.map(o => o.name))
  }

  const addNewMemberToProject = () => {
    const newMembers = projectMem.map((mem) => ({
      fullName: mem,
      email: '',
      role: 'Fresher',
      skills: ['React', "Asp.Net"],
      feedbacks: 0,
      tasks: 0,
      utilization: '0%'
    }))
    dispatch(setProjectMembers([...newMembers, ...store.projectMembers]))
    setOpen(false)
    setProjectMem([])
  }

  const handleClose = () => {
    setOpen(false);
    setProjectMem([])
  }

  return (
    <Box >
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setOpen(false)}

      >
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5} sx={{ p: 8, width: 400 }}>

            <Grid item xs={12} className='gap-1' justifyContent="space-between" alignItems="center">
              <Typography color="secondary">Add Member</Typography>
            </Grid>


            <Grid item xs={12}>
              <FormControl fullWidth>
                <CustomPeoplePicker items={members} label="Project Members" onSelect={onSelectMember} />

              </FormControl>
            </Grid>

            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button size='large' variant='outlined' color="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button size='large' variant='contained' type="submit" onClick={addNewMemberToProject}>
                Add Member
              </Button>
            </Grid>
          </Grid>
        </form>
      </Drawer>


    </Box >
  )
}

export default NewMember
