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
import { addClients, fetchClients, updateClient } from 'src/store/clients'
import { Checkbox, FormControlLabel, Grid } from '@mui/material'
import ProfileUpload from '../add/ProfileUpload'
import { clientRequest } from 'src/helpers/requests'
import { unwrapResult } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { handleResponse } from 'src/helpers/helpers'

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

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup.object().shape({
  address: yup.string().required(),
  taxId: yup.string().required(),
  email: yup.string().email().required('Email is required').typeError('Email is invalid'),
  primaryContactName: yup.string().required('Contact is required'),
  phoneNumber: yup
    .string()
    .required('Phone Number is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, 'too short')
    .max(10, 'too long'),
  companyName: yup
    .string()
    .min(3, obj => showErrors('companyName', obj.value.length, obj.min))
    .required(),
  isActive: yup.boolean().notRequired(),
  companyId: yup.string().required('Company ID is required')
})

const defaultValues = {
  companyName: '',
  primaryContactName: '',
  address: '',
  email: '',
  phoneNumber: '',
  companyId: '',
  taxId: '',
  isActive: true
}
const SidebarAddClient = props => {
  // ** Props
  const { open, toggle, editedRowData, handleEdit, editTrigger } = props

  // ** State
  const [plan, setPlan] = useState('basic')
  const [profile, setProfile] = useState(null)

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

  useEffect(() => {
    if (editedRowData) {
      const {
        companyName,
        primaryContatctName,
        address,
        email,
        phoneNumber,
        companyId,
        taxId,
        isActive
      } = editedRowData
      reset({
        companyName: companyName,
        primaryContactName: primaryContatctName || '',
        address: address,
        email: email,
        phoneNumber: phoneNumber,
        companyId: companyId,
        taxId: taxId,
        isActive: isActive
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedRowData, editTrigger])

  const onSubmit = data => {
    const profilePhoto = profile == null ? '' : profile[0].base64String
    const contactName = data.primaryContactName
    delete data.primaryContactName

    const successFunction = () => {
      dispatch(fetchClients())
      // toast.success(editedRowData ? 'Client Updated' : 'Client Created')
      toggle()
      handleEdit(null)
      reset(defaultValues)
    }

    const req = { profilePhoto: profilePhoto, primaryContatctName: contactName, ...data }
    dispatch(editedRowData ? updateClient({ id: editedRowData?.id, ...req }) : addClients(req))
      .then(unwrapResult)
      .then(res => {
        handleResponse(editedRowData ? 'update' : 'create', res, successFunction)
      })
      .catch(error => {
        toast.error(error.message)
      })
  }

  const handleProfile = file => {
    setProfile(file)
  }

  const handleClose = () => {
    toggle()
    reset(defaultValues)
    setProfile(null)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
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
            <ProfileUpload profile={profile} handleProfile={handleProfile} />
            {errors.name && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='companyName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Company name'
                  onChange={onChange}
                  //   placeholder='johndoe'
                  error={Boolean(errors.companyName)}
                />
              )}
            />
            {errors.companyName && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.companyName.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='primaryContactName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Contact name'
                  onChange={onChange}
                  error={Boolean(errors.primaryContactName)}
                />
              )}
            />
            {errors.primaryContactName && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.primaryContactName.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='phoneNumber'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Phone Number'
                  onChange={onChange}
                  error={Boolean(errors.phoneNumber)}
                />
              )}
            />
            {errors.phoneNumber && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.phoneNumber.message}
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
              name='address'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Address'
                  multiline
                  minRows={2}
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

          <FormControl sx={{ mb: 6 }}>
            <Controller
              name='isActive'
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  label='Active'
                  control={
                    <Checkbox
                      size='medium'
                      defaultChecked={value}
                      value={value}
                      onChange={onChange}
                    />
                  }
                />
              )}
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 5, alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddClient
