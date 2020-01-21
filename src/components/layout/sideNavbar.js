import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {Sidebar, Menu, Segment, Grid, Container, Placeholder, Divider, Image } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'


class SideNavbar extends Component {
    HOME = 'HOME'
    LOGIN = 'LOGIN'
    PROFILE = 'PROFILE'
    DISCOVER = 'DISCOVER'
    FEED = 'FEED'
    
    state = {
        redirect_target: null,
        targets: {
            HOME: '/',
            LOGIN: '/login',
            PROFILE: ('/profile/' + this.props.auth.uid),
            DISCOVER: '/discover',
            FEED: '/feed'
        },
        visible: false,
        isLoading: false
    }

    load = (target) => {
        this.setState({
            redirect_target: target,
            visible: false
        })
    }

    render() {
        const { profile } = this.props;
        let image = profile ? <img src={profile.imageUrl}/> : null

        const output = (
            <div className='fullsize_div' id='sidebar_2'>
                <Menu fixed='top'>
                    <Menu.Item icon='th list' onClick={() => {this.setState({visible: !this.state.visible})}}/>
                    <Menu.Item header onClick={() => {this.load(this.HOME)}}>Runtime Terror</Menu.Item>
                    <Menu.Item>{image}</Menu.Item>
                </Menu>
                <div id='sidebar'>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar as={Menu} animation={'slide along'} direction={'left'} icon='labeled' inverted vertical visible={this.state.visible} width='thin'>
                        <Menu.Item onClick={() => {this.load(this.PROFILE)}} name='Profile'>{image}Profile</Menu.Item>,
                        <Menu.Item onClick={() => {this.load(this.DISCOVER)}} icon='map' name='Discover'/>,
                        <Menu.Item onClick={() => {this.load(this.FEED)}} icon='sitemap' name='Feed'/>,
                        <Menu.Item onClick={this.props.signOut} name='Sign out' icon='sign out' position='right'/>
                    </Sidebar>
                    <Sidebar.Pusher dimmed={this.state.visible}>
                            {this.props.content}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
                </div>
            </div>
        )
        if (this.state.redirect_target != null) {
            // TODO: Change from using setstate
            console.log(this.state.redirect_target)
            let to_link = this.state.targets[this.state.redirect_target]
            console.log("redirecting... to " + to_link)
            this.setState({redirect_target: null})
            return (<div className='fullsize_div'><Redirect to={to_link}/>{output}</div>)
        }
        else if (this.state.isLoading) {
            return <div>Loading...</div>
        }
        else {            
            return output
        }
    }
}


const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}
  

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SideNavbar)
