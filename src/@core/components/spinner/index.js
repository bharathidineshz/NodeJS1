import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'

export default function SimpleBackdrop() {
  return (
    <div>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column'
        }}
        open={true}
      >
        <img src='/images/lp-white.png' className='flip-image' alt='Leanprofit' height={50} />
      </Backdrop>
    </div>
  )
}
