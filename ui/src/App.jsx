import logo from './logo.svg';
import React, { Component } from 'react'
import './App.css';
import Home from './cmps/home'
import { connect } from 'react-redux'
import actions from './actions/mainaction'
import LoadingOverlay from 'react-loading-overlay';

class APP extends Component {
  render() {
    const { main } = this.props
    console.log('props:', this.props)
    const { summary } = main
    const { showLoading } = summary
    return (
      <div className="App">
        <LoadingOverlay
          active={showLoading}
          spinner
          text='Loading your content...'
        >
        <Home />
        </LoadingOverlay>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setSummary: (key, value) => dispatch(actions.setSummary(key, value)),
})
const mapStateToProps = state => ({
  main: state.Main,
})


// export default withRouter(Backup)
export default connect(mapStateToProps, mapDispatchToProps)(APP)
