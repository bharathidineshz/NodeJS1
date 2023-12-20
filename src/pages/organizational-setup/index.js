import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { TextField, Button, Grid, Box, Typography } from '@mui/material'
import { addOrgs } from 'src/store/apps/organization/'
import { useDispatch, useSelector } from 'react-redux'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const schema = yup.object().shape({
  name: yup.string().required('Organization name is required'),
  website: yup.string().url('Invalid URL format').notRequired(),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipcode: yup.string().required('ZIP code is required')
})

const OrganizationalSetup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const dispatch = useDispatch()

  const onSubmit = data => {
    console.log(data)
    dispatch(addOrgs(data))
  }

  return (
    <Grid container>
      <Grid item md={6} sm={12} xs={12}>
        <Grid item md={12} sm={12} xs={12} rowSpacing={10} columnSpacing={10}>
          <h2 variant='h2'>{`Welcome `}</h2>
          <span>
            {/* ${decodedToken(tokenData.accessToken).first_name} */}
            You're one step away from getting started with LeanProfit
          </span>
        </Grid>
        <br />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container rowSpacing={10} columnSpacing={10}>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                {...register('name')}
                label='Organization name'
                variant='outlined'
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                {...register('website')}
                label='Website URL (Optional)'
                variant='outlined'
                error={!!errors.website}
                helperText={errors.website?.message}
                fullWidth
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <TextField
                {...register('phone')}
                label='Phone number'
                variant='outlined'
                error={!!errors.phone}
                helperText={errors.phone?.message}
                fullWidth
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <TextField
                {...register('address')}
                label='Address'
                variant='outlined'
                error={!!errors.address}
                helperText={errors.address?.message}
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                {...register('country')}
                label='Country'
                variant='outlined'
                error={!!errors.country}
                helperText={errors.country?.message}
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                {...register('city')}
                label='City'
                variant='outlined'
                error={!!errors.city}
                helperText={errors.city?.message}
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                {...register('state')}
                label='State'
                variant='outlined'
                error={!!errors.state}
                helperText={errors.state?.message}
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                {...register('zipcode')}
                label='ZIP code'
                variant='outlined'
                error={!!errors.zipcode}
                helperText={errors.zipcode?.message}
                fullWidth
              />
            </Grid>
            <Grid item md={6} sm={12}>
              <Button type='submit' variant='contained' color='primary'>
                Continue
              </Button>
            </Grid>
          </Grid>
        </form>{' '}
        <br />
        <Typography variant='body2'>
          By creating an account, you agree to our{' '}
          <a className='deskpage_terms_link' href='#'>
            Terms of Service
          </a>
        </Typography>
      </Grid>

      <Grid item md={6} sm={12}>
        {/* <img src={deskImage} alt="athen"></img> */}
      </Grid>
    </Grid>
  )
}


export default OrganizationalSetup
