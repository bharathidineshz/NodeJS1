// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import { useDispatch, useSelector } from 'react-redux'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

import * as yup from 'yup'
import { Autocomplete, FormHelperText, Grid } from '@mui/material'

// import { error } from '@babel/eslint-parser/lib/convert/index.cjs'
import { signUpUser } from 'src/store/authentication/register'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import countries from 'src/helpers/countries.json'
import states from 'src/helpers/states.json'
import currencies from 'src/helpers/currencies.json'
import { addOrgs } from 'src/store/apps/organization'
import { organizationRequest } from 'src/helpers/requests'
import toast from 'react-hot-toast'

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '46rem',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '35rem'
  }
}))

const TreeIllustration = styled('img')(({ theme }) => ({
  bottom: 0,
  left: '1.875rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    left: 0
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 700
  }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { mt: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const defaultValues = {
  name: '',
  phone: '',
  orgSize: 0,
  address: '',
  country: '',
  state: '',
  city: '',
  zipcode: '',
  currency: ''
}

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup.object().shape({
  name: yup.string().required('Organization name is required'),
  website: yup.string().url('Invalid URL format').notRequired(),
  phone: yup
    .string()
    .required('required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, 'too short')
    .max(10, 'too long'),
  orgSize: yup.number().min(0, 'Size should greater than 0').notRequired(),
  address: yup.string().required('Address is required'),
  country: yup.object().required('Country is required'),
  city: yup.object().required('City is required'),
  state: yup.object().required('State is required'),
  zipcode: yup.string().max(6, 'Invalid Zipcode').required('ZIP code is required'),
  currency: yup.string().required('Currency required')
})

const OrganizationalSetup = () => {
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

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

  const dispatch = useDispatch()
  const router = useRouter()

  const onSubmit = data => {
    const req = { ...data }
    const request = organizationRequest(req)
    dispatch(addOrgs(request)).then(res => {
      if (res.payload.status === 201 || res.payload.status === 200) {
        toast.success('Organization Created')
        reset()
        router.replace({ pathname: '/apps/timesheets' })
      } else {
        toast.error('Error Occurred')
      }
    })
  }
  console.log(watch('country'), watch('state'))

  console.log([].filter(item => item.state_code === watch('state').state_code))

  // ** Vars
  const { skin } = settings

  const imageSource =
    skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <RegisterIllustrationWrapper>
            <RegisterIllustration
              alt='register-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </RegisterIllustrationWrapper>
          <FooterIllustrationsV2
            image={<TreeIllustration alt='tree' src='/images/pages/tree-2.png' />}
          />
        </Box>
      ) : null}
      <RightWrapper
        sx={
          skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}
        }
      >
        <Box
          sx={{
            p: 12,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={
                  theme.palette.mode === 'dark'
                    ? '/images/leanprofit-white.png'
                    : '/images/leanprofit-purple.png'
                }
                alt='Leanprofit'
                height={40}
              />
            </Box>
            <Box sx={{ mb: 10 }}>
              <Typography variant='h5'>Welcome to LeanProfit!</Typography>
            </Box>
            <br />
            <Grid
              container
              spacing={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container rowSpacing={10} columnSpacing={10}>
                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='name'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label='Organization name'
                            variant='outlined'
                            onChange={onChange}
                            error={Boolean(errors.name)}
                          />
                        )}
                      />
                      {errors.name && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.name.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='website'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label='Website URL (Optional)'
                            variant='outlined'
                            onChange={onChange}
                            error={Boolean(errors.name)}
                          />
                        )}
                      />
                      {errors.website && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.website.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='phone'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            type='number'
                            label='Phone number'
                            variant='outlined'
                            onChange={onChange}
                            error={Boolean(errors.phone)}
                          />
                        )}
                      />
                      {errors.phone && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.phone.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='orgSize'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            type='number'
                            label='Organization Size'
                            variant='outlined'
                            onChange={onChange}
                            placeholder='Optional'
                            error={Boolean(errors.orgSize)}
                          />
                        )}
                      />
                      {errors.orgSize && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.orgSize.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={12} sm={12} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='address'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            label='Address'
                            variant='outlined'
                            minRows={3}
                            multiline
                            onChange={onChange}
                            error={Boolean(errors.address)}
                          />
                        )}
                      />
                      {errors.address && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.address.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='country'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Autocomplete
                            options={countries}
                            getOptionLabel={o => o.name}
                            id='autocomplete-limit-tags'
                            onChange={(e, data) => onChange(data)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                error={Boolean(errors.country)}
                                label='Country'
                                placeholder='Country'
                              />
                            )}
                          />
                        )}
                      />
                      {errors.country && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.country.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='state'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Autocomplete
                            options={
                              watch('country') != null
                                ? states.filter(o => o.country_code === watch('country').code)
                                : []
                            }
                            getOptionLabel={o => o.name || o}
                            id='autocomplete-limit-tags'
                            onChange={(e, data) => onChange(data)}
                            disabled={!watch('country')}
                            renderInput={params => (
                              <TextField
                                {...params}
                                disabled={!watch('country')}
                                error={Boolean(errors.state)}
                                label='State'
                                placeholder='State'
                              />
                            )}
                          />
                        )}
                      />
                      {errors.state && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.state.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='city'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Autocomplete
                            options={[
                              {
                                id: 1,
                                name: 'Coimbatore'
                              }
                            ]}
                            getOptionLabel={o => o.name || o}
                            id='autocomplete-limit-tags'
                            value={value}
                            onChange={(e, data) => onChange(data)}
                            disabled={!watch('state')}
                            renderInput={params => (
                              <TextField
                                {...params}
                                disabled={!watch('state')}
                                error={Boolean(errors.city)}
                                label='City'
                                placeholder='City'
                              />
                            )}
                          />
                        )}
                      />
                      {errors.city && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.city.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='zipcode'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            type='number'
                            label='ZipCode'
                            variant='outlined'
                            onChange={onChange}
                            error={Boolean(errors.zipcode)}
                          />
                        )}
                      />
                      {errors.zipcode && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.zipcode.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={6} xs={12}>
                    <FormControl fullWidth>
                      <Controller
                        name='currency'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Autocomplete
                            options={currencies}
                            getOptionLabel={o => o.cc || o}
                            id='autocomplete-limit-tags'
                            value={value}
                            onChange={(e, data) => onChange(data.cc)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                error={Boolean(errors.currency)}
                                label='Currency'
                                placeholder='Currency'
                              />
                            )}
                          />
                        )}
                      />
                      {errors.currency && (
                        <FormHelperText sx={{ color: 'error.main' }}>
                          {errors.currency.message}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} className='flex-right'>
                    <Button type='submit' variant='contained' color='primary'>
                      Create Organization
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}
OrganizationalSetup.getLayout = page => <BlankLayout>{page}</BlankLayout>
OrganizationalSetup.guestGuard = true

export default OrganizationalSetup
