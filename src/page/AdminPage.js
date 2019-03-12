import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import { withStyles } from '@material-ui/core/styles';
import { fetchUrl, fetchPostUrl } from '../data/api'

import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";

import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import lightBlue from "@material-ui/core/colors/lightBlue";
import blue from '@material-ui/core/colors/blue';

/*https://thai-pga.com/api/customfieldcreate
  userid
  fieldname
  score  => array 0-17 par 18-35 hc
*/

/*https://thai-pga.com/api/customfieldedit
  userid
  fieldname
  fieldid
  score  => array 0-17 par 18-35 hc
*/

/*https://thai-pga.com/api/matchedit
  userid
  matchid
  matchname
  classnum
  date
  typescore
  * fieldid * option
*/

/*https://thai-pga.com/api/matchdelete
  userid
  matchid
*/

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: blue.A700,
      },
    },
    MuiPickersDay: {
      isSelected: {
        backgroundColor: blue.A700,
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: blue[900],
      },
    },
  },
});

const styles = theme => ({
  root: {
    marginTop: window.innerWidth > 600 ? 64: 56
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit,
    maxWidth: 700,
    margin: 'auto'
  },
});
const createMatchCardStyles = theme =>({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    maxWidth: 700,
    margin: 'auto'
  },
  textField: {
    marginBottom: theme.spacing.unit * 2,
    minWidth: 200,
    width: '100%',
    margin: 'auto'
  },
  classnumber: {
    marginRight: theme.spacing.unit * 2
  },
  datePicker: {
    marginRight: theme.spacing.unit * 2
  },
  buttonGrid: {
    width: '100%'
  },
  button: {
    height: 56,
  },
  confirm: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    height: 56,
    color: theme.palette.getContrastText(blue['A700']),
    backgroundColor: blue['A700'],
    '&:hover': {
      backgroundColor: blue[900],
    },
  }
})
const editMatchCardStyles = theme =>({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
    maxWidth: 700,
    margin: 'auto'
  },
})
const fieldDialogStyles = theme => ({
  dialog: {
    ...theme.mixins.gutters(),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    outline: 'none',
    maxWidth: 500,
    width: '100%',
    minWidth: 300,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit * 2,
    top: theme.spacing.unit * 2,
    color: theme.palette.grey[500],
  },
  dialogTitle: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  searchBox: {
    margin: theme.spacing.unit * 2,
  },
  dialogContent: {
    margin: theme.spacing.unit * 2,
    overflow: 'auto',
    height: '100%',
    maxHeight: window.innerHeight * .7
  },

});
function handleConvertDate(date){
  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }
  return (
    date.getFullYear() + '-' +
    pad(date.getMonth() + 1) + '-' +
    pad(date.getDate())
  )
}

const FieldDialog = withStyles(fieldDialogStyles)(
  class extends React.Component<Props> {
    state = {
      fieldData: null,
      fieldSelected: null,
      searchData: ''
    }
    handleSelect = (index) =>{
      var obj = {
        fieldname: this.state.fieldData.fieldname[index],
        fieldid: this.state.fieldData.fieldid[index]
      }
      this.setState({ fieldSelected: obj })
    }
    handleSave = () =>{
      this.props.getField(this.state.fieldSelected)
      this.props.close()
    }
    async fetchLoadField(){
      const field = await fetchUrl('https://thai-pga.com/api/loadfield')
      this.setState({ fieldData: field })
    }

    componentDidMount(){
      this.fetchLoadField()
    }
    render() {
      const { classes, open, close, modalState } = this.props
      const { fieldSelected, fieldData, searchData } = this.state
      function ListItemLink(props) {
        return <ListItem button component="a" {...props} />;
      }
      return (
        <Modal
          open={modalState}
          onClose={close}>
          <div className={classes.dialog}>
            <div className={classes.dialogTitle}>
              { fieldSelected ?
                <div>
                  <Typography variant="h6">{fieldSelected.fieldname}</Typography>
                  <Button
                    color="primary"
                    className={classes.button}
                    onClick={this.handleSave}>Save</Button>
                </div>
                :<Typography variant="h6">Select Field</Typography>
              }
              {modalState ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={close}>
                  <CloseIcon fontSize="large"/>
                </IconButton>
              ) : null}
            </div>
            <Divider variant="middle" />
            <div className={classes.searchBox}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search"
                onChange={(e)=>this.setState({ searchData: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className={classes.dialogContent}>
              {fieldData ?
                fieldData.fieldname.filter((item)=>{
                    return (
                      (item.search(searchData) !== -1) ||
                      (item.toLowerCase().search(searchData.toLowerCase()) !== -1)
                    )
                  }).map((d,i) =>
                  <ListItem button onClick={()=>this.handleSelect(i)}>
                    <ListItemText primary={d} />
                  </ListItem>
                )://<p>Loading ...</p>
                ['Afghanistan','Albania','ฟหาก'].filter((item)=>{
                    return (
                      (item.search(searchData) !== -1) ||
                      (item.toLowerCase().search(searchData.toLowerCase()) !== -1)
                    )
                  }).map( d=>
                    <ListItem key={d} button>
                      <ListItemText primary={d} />
                    </ListItem>
                  )
              }
            </div>
            <div>Loadmore</div>
          </div>
        </Modal>
      );
    }
  }
);
const CreateMatchCard = withStyles(createMatchCardStyles)(
  class extends React.Component<Props> {
    state = {
      fieldDialogState: false,
      selectedDate: new Date(),
      selectedField: null,
      selectedMatchname: null,
      selectedClassnum: null,
    };

    handleFieldDialog = () => {
     this.setState({ fieldDialogState: true });
    };
    handleFieldDialogClose = () => {
     this.setState({ fieldDialogState: false });
    };

    getMatchName = (e) =>{
      this.setState({ selectedMatchname: e.target.value })
    }
    getClassnum = (e) =>{
      this.setState({ selectedClassnum: parseInt(e.target.value) })
    }
    getDate = (date) =>{
      this.setState({ selectedDate: date })
    }

    async handleCreateMatch(){
      /*
      fetchPostUrl('https://thai-pga.com/api/matchcreate'.{
        userid: parseInt(this.props.adminData),
        fieldid: this.state.selectedField,
        matchname: this.state.selectedMatchname,
        classnum: this.state.selectedClassnum,
        date: this.state.selectedDate,
      })*/
    }

    handleRefresh = () =>{
      this.setState(this.state)
    }
    componentDidMount(){
      window.addEventListener('resize', this.handleRefresh)
    }
    componentWillUnmount(){
      window.removeEventListener('resize', this.handleRefresh)
    }
    showData = () =>{
      console.log(
        'userid :',parseInt(this.props.adminData),'\n',
        'field :',this.state.selectedField,'\n',
        'date :',handleConvertDate(this.state.selectedDate),'\n',
        'classnum: ',this.state.selectedClassnum,'\n',
        'matchname :',this.state.selectedMatchname,'\n',
      );
    }

    render() {
      const { classes, adminData } = this.props
      const { expanded, selectedDate, fieldDialogState, fieldData, selectedField } = this.state;
      return (
        <ExpansionPanel className={classes.root}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ padding: 0}}>
            <Typography variant="h6">Create Match</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ flexDirection: 'column', paddingTop: 32 }}>
            <div style={{ display: 'flex', flexDirection: (window.innerWidth > 500)?'row':'column' }}>
              <TextField
                className={classes.textField}
                label="Match name"
                margin="normal"
                variant="outlined"
                onChange={this.getMatchName}/>
              <div className={classes.buttonGrid}>
                <Button
                  style={{ marginLeft: (window.innerWidth > 500)? 16:0 }}
                  className={classes.button}
                  onClick={this.handleFieldDialog}
                  color="primary">{selectedField ? selectedField.fieldname:'Select Field'}</Button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: (window.innerWidth > 500)?'row':'column' }}>
              <TextField
                style={{ width: (window.innerWidth > 500)? 150:'100%'}}
                className={classes.classnumber}
                label="Class number"
                type="number"
                margin="normal"
                variant="outlined"
                onChange={this.getClassnum}/>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <MuiThemeProvider theme={materialTheme}>
                  <DatePicker
                    style={{ width: (window.innerWidth > 500)? 200:'100%'}}
                    className={classes.datePicker}
                    keyboard
                    margin="normal"
                    variant="outlined"
                    label="Date picker"
                    value={selectedDate}
                    onChange={this.getDate}/>
                </MuiThemeProvider>
              </MuiPickersUtilsProvider>
              {fieldDialogState ?
                <FieldDialog
                  modalState={fieldDialogState}
                  open={this.handleFieldDialog}
                  close={this.handleFieldDialogClose}
                  getField={(field)=>this.setState({ selectedField: field })}
                  fieldData={fieldData} />:null
              }
            </div>
            <Button
              variant="contained"
              className={classes.confirm}
              onClick={this.showData}
              color="primary">Confirm</Button>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    }
  }
);
const EditMatchCard = withStyles(editMatchCardStyles)(
  class extends React.Component<Props> {
    async handleLoadField(){
      const match = await fetchUrl('https://thai-pga.com/api/loadmatch')
      console.log(match);
    }
    componentDidMount(){
      this.handleLoadField()
    }
    getDate = (e) =>{
      console.log(e.target.value);
    }
    render() {
      const { classes } = this.props
      return (
        <Paper className={classes.root} elevation={2}>
          <Typography variant="h6" className={classes.heading}>EditMatchCard</Typography>
        </Paper>
      );
    }
  }
);

class AdminPage extends Component {
  constructor(props){
    super(props)
  }
  render() {
    const { classes, theme, data } = this.props;
    return (
      <div className={classes.root}>
        <CreateMatchCard adminData={data}/>
        <EditMatchCard adminData={data}/>
      </div>
    );
  }
}

AdminPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AdminPage);
