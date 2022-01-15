import React from 'react'
import Stepper from '@mui/material/Stepper'
import { Step, StepLabel } from '@mui/material'

const STEPS = ['login', 'Shipping Address', 'Payment Method', 'Place Order']

export default function CheckoutWizard({ activeStep = 0 }) {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {STEPS.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
