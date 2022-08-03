import { AppBar, Typography, Box, Grid, Link } from '@mui/material'
import React from 'react'

export const Footer = () => {
  return (
    <AppBar position="relative" sx={{top:'auto', bottom:0, bgcolor: '#2276AC'}}>

      <Box display='flex' justifyContent='center' marginTop={2}>
        <Grid container spacing={2} width='60%' sx={{borderBottom: 1, mb:1}}>
          <Grid item xs={6}>
            <Box
              sx={{width: 100}}
              component='img' 
              src='assets/ghrc_logo.png'/>
            <Box
              sx={{width: 100, ml:4}}
              component='img' 
              src='assets/itsc_logo.png'/>
          </Grid>
          <Grid item xs={6} display='flex' justifyContent='right'>
            <Box
                sx={{width: 75, ml:4}}
                component='img' 
                src='assets/nasa_logo.png'/>
            <Box
              sx={{width: 100, ml:4}}
              component='img' 
              src='assets/uah_logo.png'/>
          </Grid>
        </Grid>
      </Box>
      <Box display='flex' justifyContent='center' marginBottom={2}>
          <Typography variant='caption'>
            NASA Official:
          </Typography>
          <Link target='_blank' href='mailto:manil.maskey@nasa.gov' variant='caption' color='inherit' underline='hover'>
            {' Manil Manskey'}
          </Link>
          <Link target='_blank' href='http://www.nasa.gov/about/highlights/HP_Privacy.html' 
          variant='caption' color='inherit' underline='hover' sx={{ml:2}}>
            Web Privacy Policy
          </Link>
          <Link target='_blank' href='http://science.nasa.gov/earth-science/earth-science-data/data-information-policy' 
          variant='caption' color='inherit' underline='hover' sx={{ml:2}}>
            Data & information Policy
          </Link>
          <Link target='_blank' href='http://www.nasa.gov/audience/formedia/features/communication_policy.html' 
          variant='caption' color='inherit' underline='hover' sx={{ml:2}}>
            Communications Policy
          </Link>
          <Link target='_blank' href='http://www.nasa.gov/FOIA/index.html' 
          variant='caption' color='inherit' underline='hover' sx={{ml:2}}>
            Freedom of Information Act
          </Link>
          <Link target='_blank' href='http://www.usa.gov/' 
          variant='caption' color='inherit' underline='hover' sx={{ml:2}}>
            USA.gov
          </Link>
      </Box>

    </AppBar>
  )
}
