import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';

const palette = {
  signInBtn: blue['A700'],
  text: blue[800],
  labelTable: grey[600]
}

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    margin: 'auto',
    maxWidth: 700,
  },
  tabsText: {
    color: palette.text
  },
  paper: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  title: {
    fontSize: 14,
  },
  card: {
    width: '80%',
    maxWidth: 240,
    marginTop: theme.spacing.unit * 4,
    margin: 'auto',
  },
  table: {

  },
  labelRow: {
    backgroundColor: palette.labelTable,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  cell: {
    boxSizing: 'border-box'
  },
  dateCell: {
    padding: 16,
    width: 64
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
});

class TabsOverview extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  resizeEffect = () =>{
    this.setState(this.state)
  }
  componentDidMount(){
    window.addEventListener('resize',this.resizeEffect)
  }
  componentWillUnmount(){
    window.removeEventListener('resize',this.resizeEffect)
  }
  render() {
    const { classes, theme, data } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const OverviewContent = (data? data.matchid.map((id,i)=>
      <Card key={id} className={classes.card}>
        <CardContent>
          <Typography className={classes.pos} color="textSecondary">
            {data.matchname[i]}
          </Typography>
          <Typography variant="h5" component="h2">
            {'Overall : '}
            {data.gross[i]}
            {` ( ${
              data.par[i] === 0 ? 'E' : data.par[i]
            } ) `}
          </Typography>
        </CardContent>
      </Card>
    ):null)
    const ResultContent = (
      <Table className={classes.table}>
        <TableHead>
          <TableRow className={classes.labelRow}>
            <TableCell className={classes.dateCell} style={{color: 'white'}} align="left">Date</TableCell>
            <TableCell className={classes.cell} style={{color: 'white'}} align="left">Match</TableCell>
            <TableCell className={classes.cell} style={{color: 'white'}} align="right">Overall</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { data ? data.matchid.map((id,i) =>
            <TableRow key={id} className={classes.row}>
              <TableCell className={classes.dateCell} align="left">{data.date[i]}</TableCell>
              <TableCell className={classes.cell} align="left">{data.matchname[i]}</TableCell>
              <TableCell className={classes.cell} align="right">{data.gross[i]}
                {` (${
                  data.par[i] === 0 ? 'E' : data.par[i]
                }) `}
              </TableCell>
            </TableRow>
          ):null}
        </TableBody>
      </Table>
    )

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab className={classes.tabsText} label="Overview" />
            <Tab className={classes.tabsText} label="Result" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <div dir={theme.direction}
            style={{
              display: 'grid',
              paddingBottom: 32,
              gridTemplateColumns: window.innerWidth > 540 ? 'auto auto':'auto'}}>
            {OverviewContent}
          </div>
          <div dir={theme.direction} style={{ paddingTop: 8 }}>
            {ResultContent}
          </div>
        </SwipeableViews>
      </div>
    );
  }
}

TabsOverview.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TabsOverview);
