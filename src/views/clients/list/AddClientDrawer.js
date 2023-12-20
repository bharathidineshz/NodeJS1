// ** React Imports
import { useState } from 'react'

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
import { addClients } from 'src/store/clients'

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

const schema = yup.object().shape({
  address: yup.string().required(),
  taxId: yup.string().required(),
  companyId: yup.string().required(),
  name: yup
    .string()
    .min(3, obj => showErrors('Clientname', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  //   email: '',
  address: '',
  taxId: '',
  companyId: '',
  name: ''
}

const SidebarAddClient = props => {
  // ** Props
  const { open, toggle } = props

  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.client)

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    if (store.allData.some(u => u.companyId === data.companyId || u.name === data.name)) {
      store.allData.forEach(u => {
        if (u.companyId === data.companyId) {
          setError('email', {
            message: 'Company Id already exist'
          })
        }
      })
    } else {
      dispatch(addClients({ ...data, type: 'form' }))
      toggle()
      reset()
    }
  }

  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    setValue('contact', Number(''))
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
        <Typography variant='h6'>Create New Client</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Client Name'
                  onChange={onChange}
                  //   placeholder='johndoe'
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
            )}
          </FormControl>

          {/* <FormControl fullWidth sx={{ mb: 6 }}>
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
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl> */}
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='address'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Address'
                  onChange={onChange}
                  //   placeholder='Company PVT LTD'
                  error={Boolean(errors.address)}
                />
              )}
            />
            {errors.address && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='taxId'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Tax Id'
                  onChange={onChange}
                  //   placeholder='Australia'
                  error={Boolean(errors.taxId)}
                />
              )}
            />
            {errors.taxId && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.taxId.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='companyId'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Company Id'
                  onChange={onChange}
                  //   placeholder='Australia'
                  error={Boolean(errors.companyId)}
                />
              )}
            />
            {errors.companyId && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.companyId.message}
              </FormHelperText>
            )}
          </FormControl>
          {/* <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='contact'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='number'
                  value={value}
                  label='Contact'
                  onChange={onChange}
                  placeholder='(397) 294-5153'
                  error={Boolean(errors.contact)}
                />
              )}
            />
            {errors.contact && <FormHelperText sx={{ color: 'error.main' }}>{errors.contact.message}</FormHelperText>}
          </FormControl> */}
          {/* <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Select
              fullWidth
              value={role}
              id='select-role'
              label='Select Role'
              labelId='role-select'
              onChange={e => setRole(e.target.value)}
              inputProps={{ placeholder: 'Select Role' }}
            >
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='author'>Author</MenuItem>
              <MenuItem value='editor'>Editor</MenuItem>
              <MenuItem value='maintainer'>Maintainer</MenuItem>
              <MenuItem value='subscriber'>Subscriber</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='plan-select'>Select Plan</InputLabel>
            <Select
              fullWidth
              value={plan}
              id='select-plan'
              label='Select Plan'
              labelId='plan-select'
              onChange={e => setPlan(e.target.value)}
              inputProps={{ placeholder: 'Select Plan' }}
            >
              <MenuItem value='basic'>Basic</MenuItem>
              <MenuItem value='company'>Company</MenuItem>
              <MenuItem value='enterprise'>Enterprise</MenuItem>
              <MenuItem value='team'>Team</MenuItem>
            </Select>
          </FormControl> */}
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

export default SidebarAddClient
