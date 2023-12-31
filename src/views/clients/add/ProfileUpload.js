// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import { Icon } from '@iconify/react'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const ProfileUpload = props => {
  // ** State
  const [files, setFiles] = useState([])

  // ** Hook
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    onDrop: async acceptedFiles => {
      const base64Strings = await Promise.all(
        acceptedFiles.map(async file => {
          const base64String = await getBase64String(file)

          return { file, base64String }
        })
      )
      setFiles(base64Strings)
      props?.handleProfile
        ? props.handleProfile(base64Strings)
        : null
    }
  })

  const getBase64String = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = () => {
        resolve(reader.result)
      }

      reader.onerror = error => {
        reject(error)
      }
    })
  }
  

  return (
    <Box {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      <Box
        sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}
      >
        <Box
          xs={12}
          sm={6}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            alignItems: 'center',
            border: '1px solid #d9d9d9',
            borderRadius: 0.8,
            padding: 3,
            textAlign: ['center', 'center', 'inherit']
          }}
        >
          {(files.length && props.profile )? (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
               <img
      key={''}
      alt={''}
      className='single-file-image'
      style={{ height: 50 }}
      src={files[0].base64String}
    />
              <Typography>{files[0].file.name}</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
              <Icon icon='mdi:image' fontSize={50} />
              <Typography
                color='textSecondary'
                sx={{ '& a': { color: 'primary.main', textDecoration: 'none' } }}
              >
                Drop Profile Picture or{' '}
                <Link href='/' onClick={e => e.preventDefault()}>
                  browse
                </Link>{' '}
                thorough your machine
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ProfileUpload
