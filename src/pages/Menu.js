import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AlignVerticalBottomIcon from "@mui/icons-material/AlignVerticalBottom";
import StoreIcon from "@mui/icons-material/Store";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Deconnexion } from "../controleurs/CompteControleur";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Avatar } from "@mui/material";
import Popover from "@mui/material/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { consulterListeNotificationCurrentUser } from "../controleurs/NotificationControleur";
import { useState, useEffect } from "react";
import { getConnectedUser } from "../Helpers/FireBase";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Menu({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [openArticle, setOpenArticle] = React.useState(false);
  const [openPointVente, setOpenPointVente] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleClickArticle = () => {
    setOpenArticle(!openArticle);
  };

  const handleClickPointVente = () => {
    setOpenPointVente(!openPointVente);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [notifications, setNotifications] = useState([]);
  const [countNotifications, setCountNotifications] = useState(0);
  useEffect(() => {
    console.log("use effect here");
    getConnectedUser()
      .then((_user) => {
        consulterListeNotificationCurrentUser(_user.uid).then((snapshot) => {
          console.log(snapshot);
          let values = snapshot.docs.map((doc) => doc.data());
          console.log("Notifications", values);
          setNotifications(values);
          let count = values.length;
          setCountNotifications(count);
        });
      })
      .catch((error) => {
        console.error("Error : ", error);
      });
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <img src="/logo.png" height="80" width="80"></img>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Last chance to take
          </Typography>
          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  {...bindTrigger(popupState)}
                >
                  <Badge badgeContent={countNotifications} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  {notifications.length === 0 ? (
                    <List sx={{ mb: 2 }}>
                      <ListItem>
                        <ListItemText secondary={"Aucune notification !"} />
                      </ListItem>
                    </List>
                  ) : (
                    <List sx={{ mb: 2 }}>
                      {notifications.map(
                        ({ idArticle, titreArticle, messageNotification }) => (
                          <React.Fragment key={idArticle}>
                            <ListItem>
                              <ListItemText
                                primary={titreArticle}
                                secondary={messageNotification}
                              />
                            </ListItem>
                          </React.Fragment>
                        )
                      )}
                    </List>
                  )}
                </Popover>
              </div>
            )}
          </PopupState>

          <IconButton
            size="large"
            color="inherit"
            onClick={() => {
              Deconnexion(navigate("/"));
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              navigate("/statistique");
            }}
          >
            <ListItemIcon>
              <AlignVerticalBottomIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={"Statistique"} />
          </ListItem>

          <ListItem button onClick={handleClickArticle}>
            <ListItemIcon>
              <ShoppingCartIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={"Articles"} />
            {openArticle ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openArticle} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/ajouter/article");
                }}
              >
                <ListItemIcon>
                  <AddShoppingCartIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Ajouter article" />
              </ListItem>
            </List>
          </Collapse>

          <Collapse in={openArticle} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/consulter/articles");
                }}
              >
                <ListItemIcon>
                  <ListAltIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Consulter articles" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleClickPointVente}>
            <ListItemIcon>
              <StoreIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={"Points de vente"} />
            {openPointVente ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openPointVente} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/ajouter/pointvente");
                }}
              >
                <ListItemIcon>
                  <AddBusinessIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Ajouter point vente" />
              </ListItem>
            </List>
          </Collapse>

          <Collapse in={openPointVente} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                sx={{ pl: 4 }}
                onClick={() => {
                  navigate("/consulter/pointsvente");
                }}
              >
                <ListItemIcon>
                  <ListAltIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Consulter points vente" />
              </ListItem>
            </List>
          </Collapse>
        </List>

        <Divider />
        <ListItem
          button
          onClick={() => {
            navigate("/reclamation");
          }}
        >
          <ListItemIcon>
            <ContactPageIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={"Réclamations"} />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            navigate("/modifier/compte");
          }}
        >
          <ListItemIcon>
            <AccountCircleIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={"Modifier compte"} />
        </ListItem>
        {/* button
          onClick={() => {
            navigate("/connexion");
          }} */}
        <ListItem
          button
          onClick={() => {
            Deconnexion(navigate("/"));
          }}
        >
          <ListItemIcon>
            <LogoutIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary={"Déconnexion"} />
        </ListItem>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
