// temp state for username and permstate on submit
import React from 'react';
import axios from 'axios';
import { Avatar } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import RemoveUserForm from './RemoveUserForm.jsx';
import Preferences from './Preferences.jsx';
import SignIn from './SignIn.jsx';
import Header from './Header.jsx';
import Home from './Home.jsx';
import CreateGroup from './CreateGroup.jsx';
import UserSettings from './UserSettings.jsx';
import Group from './Group.jsx';
import AddUserForm from './AddUserForm.jsx';
import Options from './Options.jsx';
import './App.css';
import Title from './TitlePage.jsx';

const userImages = {
  oppossum: 'https://cdn.discordapp.com/attachments/635332255178424335/661017399109353502/image3.jpg',
  koala: 'https://cdn.discordapp.com/attachments/635332255178424335/661017399109353505/image4.jpg',
  kangaroo: 'https://cdn.discordapp.com/attachments/635332255178424335/661017398496854075/image2.jpg',
  bilby: 'https://cdn.discordapp.com/attachments/635332255178424335/661017398496854074/image1.jpg',
  sugarGlider: 'https://cdn.discordapp.com/attachments/635332255178424335/661017398068903937/image0.jpg',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      view: 'titlepage',
      user: 'x',
      userStatus: '',
      groups: [],
      userImages,
      dietaryRestriction: 'vegan',
      image: '',
      groupName: 'supercoolpeople',
      pricePoint: '',
      members: [],
      newMember: '',
      options: [],
      categories: 'vegan',
      chooser: '',
      choiceId: '',
      choiceName: '',
      choiceLat: '',
      choiceLng: '',
      choiceAddress: '',
      chosen: false,
      showWinner: false,
      open: false,
      login: false,
      users: [],
    };
    this.handleViewChange = this.handleViewChange.bind(this);
    this.handlePreferenceChange = this.handlePreferenceChange.bind(this);
    this.handleSignInWithGoogle = this.handleSignInWithGoogle.bind(this);
    this.handleNewGroupName = this.handleNewGroupName.bind(this);
    this.handleNewGroupPricePoint = this.handleNewGroupPricePoint.bind(this);
    this.handleNewGroupSubmit = this.handleNewGroupSubmit.bind(this);
    this.handleUserSettings = this.handleUserSettings.bind(this);
    this.handleAddUserToGroup = this.handleAddUserToGroup.bind(this);
    this.handleNewGroupMember = this.handleNewGroupMember.bind(this);
    this.handleGetOptions = this.handleGetOptions.bind(this);
    this.handleChooseOption = this.handleChooseOption.bind(this);
    this.getGroupMembers = this.getGroupMembers.bind(this);
    this.getGroupPricePoint = this.getGroupPricePoint.bind(this);
    this.getUsersGroups = this.getUsersGroups.bind(this);
    this.handleGroupSetState = this.handleGroupSetState.bind(this);
    this.randomizer = this.randomizer.bind(this);
    this.handleSetState = this.handleSetState.bind(this);
    this.handleUserNameInput = this.handleUserNameInput.bind(this);
    this.handleUserStatusInput = this.handleUserStatusInput.bind(this);
    this.handleSignOutWithGoogle = this.handleSignOutWithGoogle.bind(this);
    this.toggleDialog = this.toggleDialog.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleSubmitPreferences = this.handleSubmitPreferences.bind(this);
    this.handleRemoveUserFromGroup = this.handleRemoveUserFromGroup.bind(this);
  }

  toggleDialog(type) {
    // toggles error dialog box
    if (this.state[type] === false) {
      this.setState({ type: true });
    } else {
      this.setState({ type: false });
    }
  }

  handleViewChange(view) {
    console.log(`${view} button clicked`);
    this.getUsersGroups(this.state.user);
    this.getGroupMembers(this.state.groupName);
    this.getAllUsers();
    this.setState({ view: `/${view}` });
  }

  handleLoginClick() {
    this.handleSignInWithGoogle();
  }

  handleSignInWithGoogle() {
    return window.open('/api/login', '_blank');
  }

  handleSignOutWithGoogle() {
    axios.get('/api/logout')
      .then(this.handleViewChange('/login'))
      .catch(() => {
        this.toggleDialog('open');
      });
  }

  getAllUsers() {
    axios.get('/api/users')
      .then((response) => {
        this.setState({ users: response });
      })
      .catch(() => {
        this.toggleDialog('open');
      });
  }

  hideToDo() {
    const hide = this;
    // wrapping to do in function so I can hide them and they do not stress me out
    // TODO axios.patch/groups:id/active toggles group active
    // TODO axios.get /choices  gives options of places to eat
    // TODO update group name .patch('/groups/:groupName/groupName'
    // TODO update group pricepoint '/groups/:groupName/pricePoint'
    // TODO get and post group history
    // TODO delete user from group .delete('/groups/:userName'
    // TODO create button to reset dietary restrictions axios.delete(/users/:usesrName/dietaryRestriction)
    // TODO delete group axios.delete('/groups)
    // TODO get all active groups .get('/groups/:userName/groups/active'
    // TODO get all inactive groups '/groups/:userName/groups/inactive'
    // TODO create button and write funciton to delete useraccount from db axios.delete(/users/:userName)
  }

  handleGetOptions() {
    const { groupName } = this.state;
    axios.get('/api/choices', { groupName })
      .then((response) => {
        const { data } = response;
        this.setState({
          options: data,
        });
      }).then(() => {
        this.handleViewChange('options');
      })
      .catch((error) => {
        console.log(error);
        this.toggleDialog('open');
      });
  }

  handleChooseOption(id, name, address, city, state, zipCode) {
    // set state
    this.setState({
      choiceId: id,
      choiceName: name,
      choiceAddress: `${address} ${city} ${state} ${zipCode}`,
    });
    const { groupName } = this.state;
    // make axios request to add choice to database
    axios.post('/api/groupHistory', { id, groupName }).then(() => {
      // render group view
      this.handleViewChange('group');
      this.setState({
        chosen: true,
        open: true,
      });
    })
      .catch(() => {
        this.toggleDialoque('open');
      });
  }

  handleSetState(k, v) {
    this.setState([k, v]);
    console.log('here', this.state);
  }

  handleUserSettings(k, v) {
    axios.post(`/api/users/${this.state.user}/${k}`, {
      k: v,
    }).then(this.handleSetState(k, v))
      .catch(() => {
        this.toggleDialog('open');
      });
  }

  getGroupMembers(group) {
    axios.get(`/api/groups/${group}/users`)
      .then((members) => {
        this.setState({
          members: members.data,
        });
      })
      .catch(() => {
        this.toggleDialog('open');
      });
  }

  getGroupPricePoint(group) {
    axios.get(`/api/groups/${group}/pricePoint`)
      .then((response) => {
        const { pricePoint } = response.data[0];
        this.setState({
          pricePoint,
        });
      })
      .catch(() => {
        this.toggleDialog();
      });
  }

  randomizer() {
    const { members } = this.state;
    const memberIndex = Math.floor(Math.random() * (members.length));
    this.setState({ chooser: members[memberIndex].userName, showWinner: true });
  }

  handlePreferenceChange(k, v) {
    // this.handleSetState(k, v);
    this.setState({ [k]: v });
    console.log('statetetet', this.state);
  }

  handleNewGroupPricePoint(newPricePoint) {
    this.setState({
      pricePoint: newPricePoint,
    });
  }

  handleNewGroupSubmit() {
    const {
      groupName, pricePoint, user,
    } = this.state;
    axios.post('/api/groups', {
      groupName,
      pricePoint,
      userName: user,
    })
      .catch(() => {
        this.toggleDialog('open');
      });
  }

  handleNewGroupName(e) {
    this.setState({
      groupName: e.target.value,
    });
  }

  handleGroupSetState(groupName) {
    this.setState({ groupName });
  }

  getUsersGroups(user) {
    axios.get(`/api/users/${user}/groups`)
      .then((groupList) => {
        this.setState({ groups: groupList });
      }).catch(() => {
        this.toggleDialog('open');
      });
  }

  resetGameState() {
    this.setState({
      chooser: '',
      showWinner: false,
    });
  }

  handlePass() {
    // this.setState()
    this.handleViewChange('group');
    // TODO need data to figure this out
  }

  handleNewGroupMember(e) {
    this.setState({ newMember: e.target.value });
  }

  handleUserNameInput(e) {
    const user = e.target.value;
    this.setState({ user });
  }

  handleSubmitPreferences(method) {
    const { user, image, dietaryRestriction } = this.state;
    const dietaryRestrictionArr = [dietaryRestriction];
    if (method === 'post') {
      axios.post('/api/users', { userName: user })
        .then(console.log('please wait'))
        .then(() => axios.post(`/api/users/${user}/dietaryRestrictions`, { restrictions: dietaryRestrictionArr }))
        .then(() => axios.post(`/api/users/${user}/image`, { image }))
        .then(() => {
          axios.post(`/api/users/${this.state.user}/userName`, {
            userStatus: '',
          });
        })
        .catch(() => {
          this.toggleDialog('open');
        });
    } else if (method === 'patch') {
      axios.patch(`/api/users/${user}/dietaryRestrictions`, { restrictions: dietaryRestrictionArr })
        .then(() => axios.patch(`/api/users/${user}/image`, { image }))
        .then(() => {
          axios.patch(`/api/users/${this.state.user}/userName`, {
            userStatus: this.state.status,
          });
        })
        .catch(() => {
          this.toggleDialog('open');
        });
    }
  }

  handleAddUserToGroup() {
    axios.post('/api/user_group', {
      userName: this.state.newMember,
      groupName: this.state.groupName,
    })
      .catch(() => {
        this.toggleDialog('open');
      });
  }

  handleRemoveUserFromGroup(userName) {
    axios.delete(`/api/groups/${this.state.newMember}`, {
      userName: this.state.newMember,
      groupName: this.state.groupName,
    });
  }

  handleUserStatusInput(e) {
    this.setState({ userStatus: e.target.value });
  }

  render() {
    const {
      view, groups, group, members,
      options, groupName, pricePoint, open,
      chooser, choiceId, choiceName, choiceAddress, chosen, userStatus, userImage,
      showWinner, user, userImages, dietaryRestriction, users, tempMember,
    } = this.state;
    const {
      randomizer, getGroupMembers, getGroupPricePoint, handleGroupSetState, handleGetOptions,
      handleChooseOption, handlePreferenceChange, handleSubmitPreferences,
      handleNewGroupMember, handleSetState, handleAddUserToGroup, handleViewChange,
      handleLoginClick, toggleLoginDialog, handleSignInWithGoogle, handleNewGroupName,
      handleNewGroupPricePoint, handleRemoveUserFromGroup, handleNewGroupSubmit, handleUserSettings, handleUserNameInput,
      handleDietaryRestrictionsSetState, handleUserStatusInput, toggleDialog, handlePass, handleSignOutWithGoogle,
    } = this;
    let View;
    if (view === '/login') {
      View = <SignIn handleSignInWithGoogle={handleSignInWithGoogle}/>;
    } else if (view === '/profile') {
      View = <Preferences
              koala={'https://cdn.discordapp.com/attachments/635332255178424335/661017399109353505/image4.jpg'}
              oppossum={'https://cdn.discordapp.com/attachments/635332255178424335/661017399109353502/image3.jpg'}
              bilby={'https://cdn.discordapp.com/attachments/635332255178424335/661017398496854074/image1.jpg'}
              kangaroo={'https://cdn.discordapp.com/attachments/635332255178424335/661017398496854075/image2.jpg'}
              sugarGlider={'https://cdn.discordapp.com/attachments/635332255178424335/661017398068903937/image0.jpg'}
              handleDietaryRestrictionsSetState={handleDietaryRestrictionsSetState}
              handleUserStatusInput={handleUserStatusInput}
              handleSignInWithGoogle={handleSignInWithGoogle}
              handleSetState={handleSetState}
              handleViewChange={handleViewChange}
              handlePreferenceChange={handlePreferenceChange}
              handleSubmitPreferences={handleSubmitPreferences}
              handleUserNameInput={handleUserNameInput}
              userImages={userImages}/>;
    } else if (view === '/createGroup') {
      View = <CreateGroup
                handleViewChange={handleViewChange}
                handleNewGroupName={handleNewGroupName}
                handlePreferenceChange={handlePreferenceChange}
                handleSetState={handleSetState}
                handleNewGroupPricePoint={handleNewGroupPricePoint}
                handleNewGroupSubmit={handleNewGroupSubmit}
                handleAddUserToGroup={handleAddUserToGroup}
                koala={'https://cdn.discordapp.com/attachments/635332255178424335/661017399109353505/image4.jpg'}
                oppossum={'https://cdn.discordapp.com/attachments/635332255178424335/661017399109353502/image3.jpg'}
                bilby={'https://cdn.discordapp.com/attachments/635332255178424335/661017398496854074/image1.jpg'}
                kangaroo={'https://cdn.discordapp.com/attachments/635332255178424335/661017398496854075/image2.jpg'}
                sugarGlider={'https://cdn.discordapp.com/attachments/635332255178424335/661017398068903937/image0.jpg'}
                handleDietaryRestrictionsSetState={handleDietaryRestrictionsSetState}
                handleUserStatusInput={handleUserStatusInput}
                handleSignInWithGoogle={handleSignInWithGoogle}
                handleSubmitPreferences={handleSubmitPreferences}
                users={users}
                handleUserNameInput={handleUserNameInput}/>;
    } else if (view === '/home') {
      View = <Home
                groups={groups}
                user={user}
                getGroupMembers={getGroupMembers}
                getGroupPricePoint={getGroupPricePoint}
                handleViewChange={handleViewChange}
                handleGroupSetState={handleGroupSetState}/>;
    } else if (view === '/userSetting') {
      View = <UserSettings
                koala={'https://cdn.discordapp.com/attachments/635332255178424335/661017399109353505/image4.jpg'}
                oppossum={'https://cdn.discordapp.com/attachments/635332255178424335/661017399109353502/image3.jpg'}
                bilby={'https://cdn.discordapp.com/attachments/635332255178424335/661017398496854074/image1.jpg'}
                kangaroo={'https://cdn.discordapp.com/attachments/635332255178424335/661017398496854075/image2.jpg'}
                sugarGlider={'https://cdn.discordapp.com/attachments/635332255178424335/661017398068903937/image0.jpg'}
                handleDietaryRestrictionsSetState={handleDietaryRestrictionsSetState}
                handleUserStatusInput={handleUserStatusInput}
                handleSignInWithGoogle={handleSignInWithGoogle}
                handleSetState={handleSetState}
                handleViewChange={handleViewChange}
                handlePreferenceChange={handlePreferenceChange}
                handleSubmitPreferences={handleSubmitPreferences}
                handleUserNameInput={handleUserNameInput}
                userImages={userImages}/>;
    } else if (view === '/group') {
      View = <Group user={user}
                userImages={userImages}
                group={group} groupName={groupName}
                groupMembers={members}
                pricePoint={pricePoint}
                handleGetOptions={handleGetOptions}
                getGroupMembers={getGroupMembers}
                getGroupPricePoint={getGroupPricePoint}
                handleViewChange={handleViewChange}
                randomizer={randomizer}
                chooser={chooser}
                showWinner={showWinner}
                open={open}
                toggleDialog={toggleDialog}
                choiceAddress={choiceAddress}
                users={users}
                choiceName={choiceName}/>;
    } else if (view === '/addUserToGroup') {
      View = <AddUserForm
      users={users} tempMember={tempMember}
                handleViewChange={handleViewChange}
                handleNewGroupMember={handleNewGroupMember}
                handleAddUserToGroup={handleAddUserToGroup} />;
    } else if (view === '/removeUserFromGroup') {
      View = <RemoveUserForm
      users={users} tempMember={tempMember}
                handleViewChange={handleViewChange}
                handleNewGroupMember={handleNewGroupMember}
                handleRemoveUserFromGroup={handleRemoveUserFromGroup} />;
    } else if (view === '/options') {
      View = <Options
                options={options}
                handlePass={handlePass}
                handleChooseOption={handleChooseOption}/>;
    } else {
      View = <Home
                groups={groups}
                getGroupMembers={getGroupMembers}
                handleViewChange={handleViewChange}
                userImage={userImage}
                handleGroupSetState={handleGroupSetState}/>;

      View = <Title handleViewChange={handleViewChange} />;
    }

    return (
            <div>
               {/* <MuiThemeProvider muiTheme={muiTheme}></MuiThemeProvider> */}
                <Header handleViewChange={handleViewChange} handleSignInWithGoogle={handleLoginClick} handleSignOutWithGoogle={handleSignOutWithGoogle} />
                {/* <Avatar src={userImages.kangaroo}/> */}
                <Dialog onBackdropClick={() => { toggleDialog(); }} open={this.state.open}>
                    <DialogTitle>Sorry {user} an error has occurred</DialogTitle>
                </Dialog>
                <Dialog onBackdropClick={() => { toggleLoginDialog(); }} open={this.state.login}>
                    <DialogTitle>Welcome {user} You have signed in</DialogTitle>
                </Dialog>
                {View}
        </div>

    );
  }
}

export default App;
