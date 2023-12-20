// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'
import CustomSkillPicker from 'src/views/components/autocomplete/CustomSkillPicker'
import { SKILLS, roles } from 'src/helpers/constants'
import { Autocomplete } from '@mui/material'
import { userRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { fetchSkills } from 'src/store/apps/user'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))
const skill = yup.string()
const schema = yup.object().shape({
  email: yup.string().email().required(),
  cost: yup
    .number()
    .typeError('Cost field is required')

    // .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
    .required(),
  firstName: yup
    .string()
    .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  lastName: yup
    .string()
    .min(3, obj => showErrors('Last Name', obj.value.length, obj.min))
    .required(),
  role: yup.number().required('Role is required'),
  reportingManager: yup.string()
})

const defaultValues = {
  email: '',
  firstName: '',
  lastName: '',
  cost: 0,
  role: 0,
  reportingManager: ''
}

const SidebarAddUser = props => {
  // ** Props
  const { open, toggle } = props

  // ** State
  const [plan, setPlan] = useState([])
  const [role, setRole] = useState(4)
  const [skills, setSkills] = useState([])

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

  useEffect(() => {
    dispatch(fetchSkills())
  }, [])

  const {
    reset,
    control,
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = () => {
    console.log(watch())
    console.log(skills)
    const user = store.users.find(o => o.fullName === watch('reportingManager'))
    const _skills = skills.map(o => o.id)
    const req = {
      reportingManagerId: user ? user.id : 0,
      departmentId: null,
      skills: _skills,
      ...watch()
    }
    const request = userRequest(req)
    dispatch(addUser(request))
      .then(unwrapResult)
      .then(res => {
        if (res.status === 200) {
          toast.success('User Created')
        } else {
          toast.error('Error Occurred')
        }
        handleClose()
      })
  }

  const handleSkills = values => {
    setSkills(values)
  }

  const handleClose = () => {
    setSkills([])
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add User</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='firstName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Full Name'
                  onChange={onChange}
                  // placeholder='John Doe'
                  error={Boolean(errors.firstName)}
                />
              )}
            />
            {errors.firstName && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.firstName.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='lastName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Last Name'
                  onChange={onChange}
                  // placeholder='johndoe'
                  error={Boolean(errors.lastName)}
                />
              )}
            />
            {errors.lastName && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.lastName.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='email'
                  value={value}
                  label='Email'
                  onChange={onChange}
                  placeholder='johndoe@email.com'
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='cost'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='number'
                  value={value}
                  label='Cost'
                  onChange={onChange}
                  // placeholder='(397) 294-5153'
                  error={Boolean(errors.cost)}
                />
              )}
            />
            {errors.cost && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.cost.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Controller
              name='role'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Select
                  fullWidth
                  value={value}
                  id='select-role'
                  label='Select Role'
                  labelId='role-select'
                  onChange={onChange}
                  inputProps={{ placeholder: 'Select Role' }}
                  error={Boolean(errors.role)}
                >
                  {Object.keys(roles).map((key, i) => (
                    <MenuItem key={i} value={i + 1}>
                      {roles[key].name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.role && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.role.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='reportingManager'
              control={control}
              rules={{ required: store.users?.length > 0 ? true : false }}
              render={({ field }) => (
                <Autocomplete
                  options={store.users}
                  id='autocomplete-limit-tags'
                  getOptionLabel={option => (option?.fullName ? option.fullName : option)}
                  onChange={(e, v) => {
                    field.onChange(e.target.innerText)
                  }}
                  value={field.value?.fullName ? field.value.fullName : field.value}
                  renderInput={params => (
                    <TextField
                      {...params}
                      error={Boolean(errors.reportingManager)}
                      label='Reporting Manager'
                    />
                  )}
                />
              )}
            />
            {errors.reportingManager && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.reportingManager.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <CustomSkillPicker
              values={skills}
              items={store.skills ? store.skills : []}
              label='Skills'
              setSkills={handleSkills}
            />
            {skills.length === 0 && (
              <FormHelperText sx={{ color: 'error.main' }}>Skills required</FormHelperText>
            )}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
