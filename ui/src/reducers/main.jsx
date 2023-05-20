/* eslint-disable camelcase */
// import BackupConstants from '../actions/backupconstants'
import constants from '../actions/mainconstant'
const eventDefault = {
  summary: {
    login: false,
    token: '',
    showLoading: false,
    cmptype: '',
    accountDetails: false,
    userDetails: '',
    selectedTab: 'dashboard'
  },
}


function setBackupSummary(state, action) {
  const { summary } = state
  switch (action.key) {
    case 'login':
    case 'token':
    case 'showLoading':
    case 'cmptype':
    case 'userDetails':
    case 'selectedTab':
    case 'accountDetails':
      return Object.assign({}, state, {
        summary: { ...summary, [action.key]: action.value },
      })
    default:
      return state
  }
}


export default function reducer(state = eventDefault, action) {
  switch (action.type) {
    case constants.SET_SUMMARY:
      return setBackupSummary(state, action)
    default:
      return state
  }
}
