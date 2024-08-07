import React from 'react';
import { styled, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import defaulttheme from "../Template/theme.js";
import { Button, ListItem } from '@mui/material';
import AddDeckDialog from './addDeck.js';
import DataContext from '../context/DataContext.js';
import { DeckList } from "../Deck/deckList.js";
import { useNavigate } from "react-router-dom";

function getAvatarInitials(name) {
  return name.split(' ').map(part => part.charAt(0)).join('');
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.secondary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      color: theme.palette.secondary.contrastText,
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.secondary.main,
}));

export default function Dashboard() {
  const navigate = useNavigate();
  const { userName, cardNo, deckNo, setDeckNo, setCardNo, toggleAddDeck } = React.useContext(DataContext);

  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  const setValues = (deckNo, cardNo) => {
    setDeckNo(deckNo);
    setCardNo(cardNo);
    sessionStorage.setItem('deckNo', deckNo);
    sessionStorage.setItem('cardNo', cardNo);
  };

  setValues(deckNo, cardNo);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    handleProfileMenuClose();
  };
  const handleAddDeckOpen = () => {
    setDialogOpen(true);
  };

  const handleAddDeckClose = () => {
    setDialogOpen(false);
  };

  const isMenuOpen = Boolean(anchorEl);

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleProfileMenuClose}
    >
      <MenuItem onClick={handleLogout}>Log Out</MenuItem>
    </Menu>
  );

  return (
    <ThemeProvider theme={defaulttheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="profile"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
            >
              <StyledAvatar>{getAvatarInitials(userName)}</StyledAvatar>
            </IconButton>
          </Toolbar>
        </AppBar>
        {renderProfileMenu}
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <Typography sx={{ color: defaulttheme.palette.secondary.main, fontWeight: 'bold', textAlign: 'start' }}>
              Hey   &nbsp;<span style={{ fontSize: '1.5rem' }}>{userName}</span>
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            <ListItem>
              <Typography variant="h6" sx={{ color: defaulttheme.palette.secondary.main }}>
                🗂️ &nbsp;
                <span style={{ fontSize: '1.5rem' }}>{deckNo}</span>
                &nbsp;&nbsp;
                <span style={{ fontSize: '0.9rem' }}>  Number of Decks</span>
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant="h6" sx={{ color: defaulttheme.palette.secondary.main }}>
                🃏 
                <span style={{ fontSize: '1.5rem' }}> {cardNo}</span>
                &nbsp;&nbsp;
                <span style={{ fontSize: '0.9rem' }}>  Number of Cards</span>
              </Typography>
            </ListItem>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box textAlign="right">
              {toggleAddDeck && (
                <Button
                  variant="outlined"
                  onClick={handleAddDeckOpen}
                  sx={{
                    borderColor: defaulttheme.palette.secondary.main,
                    color: defaulttheme.palette.secondary.dark,
                    '&:hover': {
                      borderColor: defaulttheme.palette.secondary.main,
                      backgroundColor: defaulttheme.palette.action.hover,
                      color: defaulttheme.palette.secondary.main,
                    },
                    mx: 1,
                  }}
                >
                  Add Deck
                </Button>
              )}
            </Box>
            <DeckList setValues={setValues} />
            {/* <Copyright sx={{ pt: 4 }} /> */}
          </Container>
        </Box>
      </Box>
      <AddDeckDialog
        setValues={setValues}
        open={dialogOpen}
        onClose={handleAddDeckClose}
      />
    </ThemeProvider>
  );
}
