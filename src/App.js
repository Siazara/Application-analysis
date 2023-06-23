import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
  Link as RouterLink,
  Route,
  Routes,
  MemoryRouter,
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import RetentionPlot from './pages/RetentionPlot';
import MyappOpenReaderHourly from './pages/MyappOpenReaderHourly';
import ClusteringVisits from './pages/ClusteringVisits';
import SampleHourlyPlotPerDay from './pages/SampleHourlyPlotPerDay';
import EventHourlyVisits from './pages/EventHourlyVisits';
import MostReadItems from './pages/MostReadItems';
import SampleContentClustering from './pages/SampleContentClustering';
import MostSearchedItems from './pages/MostSearchedItems';
import styled from '@emotion/styled';
import { Drawer } from '@mui/material';


function Router(props) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="/">{children}</StaticRouter>;
  }

  return (
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      {children}
    </MemoryRouter>
  );
}

Router.propTypes = {
  children: PropTypes.node,
};

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef(function Link(itemProps, ref) {
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
      }),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};


const StyledPaper = styled(Paper)(
  `
  background: #34495E;
  color: white;
  `
);

export default function ListRouter() {
  return (
    <Router>
      <Box
        sx={{
          height: "100%",
          display: 'flex',
        }}
      >
        <Drawer
          sx={{
            width: '20%',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: '20%',
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
          PaperProps={{
            sx: {
              backgroundColor: "#34495E",
              color: "white",
            }
          }}
        >
          <StyledPaper elevation={0} aria-label="side bar">
            <List aria-label="main analytics">
              <ListItemLink to="/" primary="RetentionPlot" icon={<HomeIcon style={{ color: 'white' }} />} />
              <ListItemLink to="/ClusteringVisits" primary="ClusteringVisits" icon={<TrendingUpIcon style={{ color: 'white' }} />} />
              <ListItemLink to="/EventHourlyVisits" primary="EventHourlyVisits" icon={<AnalyticsIcon style={{ color: 'white' }} />} />
            </List>
            <Divider />
            <List aria-label="secondary analytics">
              <ListItemLink to="/myAppOpenReaderHourly" primary="myAppOpenReaderHourly" icon={<PieChartIcon style={{ color: 'white' }} />} />
              <ListItemLink to="/SampleHourlyPlotPerDay" primary="SampleHourlyPlotPerDay" icon={<BarChartIcon style={{ color: 'white' }} />} />
              <ListItemLink to="/MostReadItems" primary="MostReadItems" icon={<AnalyticsIcon style={{ color: 'white' }} />} />
              <ListItemLink to="/MostSearchedItems" primary="MostSearchedItems" icon={<AnalyticsIcon style={{ color: 'white' }} />} />
              <ListItemLink to="/SampleContentClustering" primary="SampleContentClustering" icon={<AnalyticsIcon style={{ color: 'white' }} />} />
            </List>
          </StyledPaper>
        </Drawer>
        <Routes>
          <Route path="/" element={<RetentionPlot />} />
          <Route path="/ClusteringVisits" element={<ClusteringVisits />} />
          <Route path="/EventHourlyVisits" element={<EventHourlyVisits />} />
          <Route path="/myAppOpenReaderHourly" element={<myAppOpenReaderHourly />} />
          <Route path="/SampleHourlyPlotPerDay" element={<SampleHourlyPlotPerDay />} />
          <Route path="/MostReadItems" element={<MostReadItems />} />
          <Route path="/MostSearchedItems" element={<MostSearchedItems />} />
          <Route path="/SampleContentClustering" element={<SampleContentClustering />} />
        </Routes>
      </Box>
    </Router>
  );
}
