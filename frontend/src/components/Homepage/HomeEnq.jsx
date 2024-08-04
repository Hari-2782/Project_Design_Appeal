import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
<<<<<<< HEAD
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
`;

const StyledButton = styled(Button)(({ theme }) => ({
  border: '3px solid',
  borderColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  height: 'auto',
  padding: theme.spacing(2, 5),
  transition: 'all 0.3s ease-in-out',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
  animation: `${pulse} 2s infinite`,
}));

const ImageBox = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));
=======
import Typography from './Typography';
import { useNavigate } from 'react-router-dom';
>>>>>>> d24d98bd053f230900551bee9ed2acdbca7be86e

function ProductSmokingHero() {
  const navigate = useNavigate(); // Get the navigate function from useNavigate

  const handleRedirect = () => {
    navigate('/feedback'); // Use navigate to redirect to the feedback page
  };

  return (
    <Container
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        my: 9,
        textAlign: 'center',
      }}
    >
<<<<<<< HEAD
      <StyledButton>
        <Typography variant="h4" component="span" fontWeight="bold">
          Got any questions? Need help?
        </Typography>
      </StyledButton>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          my: 3, 
          fontSize: '1.2rem',
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        We are here to help. Get in touch!
      </Typography>
      <ImageBox>
        <Box
          component="img"
          src="/contuct.png"
          alt="Contact"
          sx={{ width: 50, height: 50 }}
        />
      </ImageBox>
=======
      <Button
        sx={{
          border: '4px solid currentColor',
          borderRadius: 0,
          height: 'auto',
          py: 2,
          px: 5,
        }}
        onClick={handleRedirect} // Attach the handleRedirect function to onClick
      >
        <Typography variant="h4" component="span">
          Got any questions? Need help?
        </Typography>
      </Button>

      <Typography variant="subtitle1" sx={{ my: 3 }}>
        We are here to help. Get in touch!
      </Typography>
      <Box
        component="img"
        src="/contuct.png"
        alt="Contact"
        sx={{ width: 60 }}
      />
>>>>>>> d24d98bd053f230900551bee9ed2acdbca7be86e
    </Container>
  );
}

export default ProductSmokingHero;
