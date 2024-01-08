// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import CustomChip from 'src/@core/components/mui/chip'
import * as yup from 'yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  Autocomplete,
  Avatar,
  Checkbox,
  Chip,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Typography
} from '@mui/material'

//** Third Party */
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUsers,
  setCategories,
  setEditTask,
  setEmpty,
  setNewTask,
  setProjectMembers,
  setTaskLists
} from 'src/store/apps/projects'
import { formatLocalDate } from 'src/helpers/dateFormats'
import toast from 'react-hot-toast'
import CustomPeoplePicker from 'src/views/components/autocomplete/CustomPeoplePicker'
import { unwrapResult } from '@reduxjs/toolkit'
import { projectAssigneeRequest } from 'src/helpers/requests'
import { postAssignee, fetchProjectAssignee } from 'src/store/apps/projects'
import { handleResponse } from 'src/helpers/helpers'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router';


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

const defaultValues = {
  allocatedProjectCost: '',
  projectId: '',
  userId: {},
  projectRoleId: {},
  availablePercentage: ''
}

const schema = yup.object().shape({
  allocatedProjectCost: yup.number().notRequired(),
  userId: yup.object().required('user required')
})

const NewMember = ({ isOpen, setOpen }) => {
  const [assignees, setAssignees] = useState()
  const [members, setMembers] = useState([])
  const [projectMem, setProjectMem] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)

  const dispatch = useDispatch()
  const store = useSelector(state => state.projects)

  console.log(members)
  useEffect(() => {
    dispatch(fetchUsers())
      .then(unwrapResult)
      .then(res => {
        setMembers(res.result)
      })
  }, [])

  const STATUS = ['Completed', 'Not Started', 'Working on it', 'Due']
  const STATUS_COLOR = ['success', 'warning', 'info', 'error']

  const roles = {
    2: { name: 'Management', icon: 'mdi:cog-outline', color: 'warning.main', id: 2 },
    4: { name: 'User', icon: 'mdi:account-outline', color: 'primary.main', id: 4 }
  }

  const onSelectMember = e => {
    setProjectMem(e.map(o => o.userName))
  }

  // const addNewMemberToProject = () => {
  //   // const newMembers = projectMem.map(mem => ({
  //   //   allocatedProjectCost: 0,
  //   //   projectId: 0,
  //   //   userId: 0,
  //   //   projectRoleId: 0,
  //   //   availablePercentage: 0
  //   // }))
  //   dispatch(setProjectMembers([...newMembers, ...store.projectMembers]))
  //   setOpen(false)
  //   setProjectMem([])
  // }

  // const updateMember = newReq => {
  // }

  const {
    register,
    reset,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const router = useRouter();


  const updateMember = newReq => {
    dispatch(fetchProjectAssignee())
  }
  const onSubmit = data => {
    const req = {
      ...data,
      userId: data.userId.id,
      projectId: Number(localStorage.getItem('projectId')),
      projectRoleId: data.projectRoleId.id,
      availablePercentage: Number(data.availablePercentage)
    }
    const request = projectAssigneeRequest(req)

    dispatch(postAssignee(request))
      .then(unwrapResult)
      .then(res => {
        handleResponse('create', res.data, updateMember)
      })
  }

  const handleClose = () => {
    setOpen(false)
    setProjectMem([])
  }
  console.log(Object.values(roles))

  return (
    <Box>
      <Drawer anchor='right' open={isOpen} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5} sx={{ p: 8, width: 400 }}>
            <Grid item xs={12} className='gap-1' justifyContent='space-between' alignItems='center'>
              <Typography color='secondary'>Add Member</Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='userId'
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      label='Project Member'
                      options={members.map(x => ({
                        name: x.firstName + ' ' + x.lastName,
                        id: x.id
                      }))}
                      getOptionLabel={option => option.name}
                      id='autocomplete-limit-tags'
                      value={field.value}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      renderInput={params => <TextField {...params} label='Project Member' />}
                    />

                    // <CustomPeoplePicker
                    //   items={members || []}
                    //   label='Project Members'
                    //   onSelect={onSelectMember}
                    //   error={Boolean(errors.userId)}
                    // />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='allocatedProjectCost'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type='number' label='Allocated Project Cost' />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='availablePercentage'
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type='number' label='Available Percentage' />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='projectRoleId'
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      label='Project Role Id'
                      options={Object.values(roles)}
                      getOptionLabel={option => option.name}
                      id='autocomplete-limit-tags'
                      value={field.value}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      renderInput={params => <TextField {...params} label='Project Role Id' />}
                    />
                  )}
                />
              </FormControl>
            </Grid>

            <Grid columnGap={2} item xs={12} className='flex-right' sx={{ mt: 5 }}>
              <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
                Close
              </Button>
              <Button size='large' variant='contained' type='submit'>
                Add Member
              </Button>
            </Grid>
          </Grid>
        </form>
      </Drawer>
    </Box>
  )
}

export default NewMember