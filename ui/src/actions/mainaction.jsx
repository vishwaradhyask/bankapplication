import constants from './mainconstant'

const GlobalAction = {
    setSummary: (key, value) => ({ type: constants.SET_SUMMARY, key, value }),
}

export default GlobalAction
