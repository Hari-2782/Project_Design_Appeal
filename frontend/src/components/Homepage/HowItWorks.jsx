

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faDollarSign, faPencilRuler, faCode, faRocket } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import CheckIcon from '@mui/icons-material/Check';
import Typography from './Typography';

import './HowWeWorkSection.css';

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: '#784af4',
    borderTopWidth: 4,
    borderRadius: 4,
  },
}));

const StepIconRoot = styled('div')(({ ownerState }) => ({
  color: ownerState.active ? '#784af4' : '#784af4',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  '& .StepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
  },
  '& .StepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function CustomStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <StepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <CheckIcon className="StepIcon-completedIcon" />
      ) : (
        <div className="StepIcon-circle" />
      )}
    </StepIconRoot>
  );
}

const steps = [
  {
    label: '1. Primary Discussion',
    description: 'Discuss your project requirements with us.',
    icon: faComments,
  },
  {
    label: '2. Guide Price',
    description: 'Receive an estimated price for your project.',
    icon: faDollarSign,
  },
  {
    label: '3. Research and Design',
    description: 'Our team researches and designs your project.',
    icon: faPencilRuler,
  },
  {
    label: '4. Development Stage',
    description: 'We develop your project according to the design.',
    icon: faCode,
  },
  {
    label: '5. Project Launch',
    description: 'We launch your project to the public.',
    icon: faRocket,
  },
];

function HowWeWorkSection() {
  return (
    <div className="how-we-work-container">
      <Typography color="inherit" align="center" variant="h3" marked="center"sx={{ textShadow: '2px 2px 4px black', mb: 2, mt: 5 }}>
      How We Work
      </Typography>
      <Stack sx={{ width: '100%' }} spacing={4}>
        <Stepper alternativeLabel activeStep={0} connector={<CustomConnector />}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <FontAwesomeIcon icon={step.icon} className="step-icon" />
                <h3>{step.label}</h3>
                <p>{step.description}</p>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    </div>
  );
}

export default HowWeWorkSection;
