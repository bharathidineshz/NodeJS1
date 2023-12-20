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
import { FormHelperText } from '@mui/material'

// import { error } from '@babel/eslint-parser/lib/convert/index.cjs'
import { signUpUser } from 'src/store/authentication/register'

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
    maxWidth: 450
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

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [Password, setPassword] = useState(false)

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})

  const validationSchema = yup.object().shape({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password')
  })

  const dispatch = useDispatch()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const body = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password
      }

      await validationSchema.validate(formData, { abortEarly: false })
      dispatch(signUpUser(body))

      // Validation successful, continue with form submission or API call
      console.log('Form is valid:', formData)
      setErrors({}) // Reset errors on successful validation
    } catch (error) {
      // Validation failed, handle errors
      console.error('Validation Error:', error.message)
      setErrors(error.message)
    }
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

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
              <img src='/images/leanprofit-white.png' alt='' height={40} />
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h5'>Welcome to LeanProfit!</Typography>
            </Box>
            {/* <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}> */}
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <TextField
                fullWidth
                sx={{ mb: 4 }}
                label='First name'
                name='first_name'
                value={formData.first_name}
                onChange={handleChange}
                error={Boolean(errors.first_name)}
                helperText={errors.first_name}
              />

              <TextField
                fullWidth
                sx={{ mb: 4 }}
                label='Last name'
                name='last_name'
                value={formData.last_name}
                onChange={handleChange}
                error={Boolean(errors.last_name)}
                helperText={errors.last_name}
              />

              <TextField
                fullWidth
                sx={{ mb: 4 }}
                label='Email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <OutlinedInput
                  label='Password'
                  id='auth-login-v2-password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon icon={showPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                      </IconButton>
                    </InputAdornment>
                  }
                  error={Boolean(errors.password)}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.password}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel
                  htmlFor='auth-login-v2-confirm-password'
                  error={Boolean(errors.confirmPassword)}
                >
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  label='Confirm Password'
                  id='auth-login-v2-confirm-password'
                  name='confirmPassword'
                  type={Password ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setPassword(!Password)}
                      >
                        <Icon icon={Password ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                      </IconButton>
                    </InputAdornment>
                  }
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.confirmPassword}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControlLabel
                control={<Checkbox />}
                sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                label={
                  <>
                    <Typography variant='body2' component='span'>
                      I agree to{' '}
                    </Typography>
                    <LinkStyled href='/' onClick={e => e.preventDefault()}>
                      privacy policy & terms
                    </LinkStyled>
                  </>
                }
              />
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                Sign up
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                <Typography variant='body2' sx={{ mr: 2 }}>
                  Already have an account?
                </Typography>
                <Typography variant='body2'>
                  <LinkStyled href='/login'>Sign in instead</LinkStyled>
                </Typography>
              </Box>
              <Divider sx={{ my: theme => `${theme.spacing(5)} !important` }}>or</Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton
                  href='/'
                  component={Link}
                  sx={{ color: '#497ce2' }}
                  onClick={e => e.preventDefault()}
                >
                  <Icon icon='mdi:facebook' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  sx={{ color: '#1da1f2' }}
                  onClick={e => e.preventDefault()}
                >
                  <Icon icon='mdi:twitter' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  onClick={e => e.preventDefault()}
                  sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                >
                  <Icon icon='mdi:github' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  sx={{ color: '#db4437' }}
                  onClick={e => e.preventDefault()}
                >
                  <Icon icon='mdi:google' />
                </IconButton>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}
Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true

export default Register
