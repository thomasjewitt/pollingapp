import { Link } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button} from '@material-ui/core';


export function HomePage() {
  return (
    <Container>
        <Paper>
          <Box sx={{height: "30vh"}} 
               display="flex" 
               justifyContent="space-around" 
               flexDirection="column" 
               alignItems="center">
            <Typography variant="h2" align="center">Example Polling Application</Typography>
            <Button 
               variant="contained" 
               color="primary"
               component={Link}
               to="/create/">New Poll</Button>
          </Box>
        </Paper>
    </Container>
  );
}
