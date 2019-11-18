import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom';
import PostList from '../feed/PostList';
import UserList from './UserList';

// import './AppNew.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();


export class Profile extends Component {
	constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
			loggedIn: token ? true : false,
			display: 'Mutters'
		}
	}

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  handleClick = (e) => {
  	if (e.target.id == '' || e.target.id == this.state.display) return;
  	document.getElementById(this.state.display).innerHTML = this.state.display;
  	this.setState({
  		display: e.target.id
  	});
  	document.getElementById(e.target.id).innerHTML = "<b><u>"+e.target.id+"</u><b>";
  }

  getContent = () => {
    const { posts, auth, users } = this.props;
  	switch(this.state.display) {
  		case 'Mutters':
  			const uid = auth.uid;
  			const myPosts = (posts != null ? posts.filter(post => post.authorId == uid) : []); 
  			return (
  				<div className="row">
          			<div className="col">
            			<PostList posts={myPosts} />
         	 		</div>
        		</div>
  			);
  			break;
  		case 'Followers':
  			return (
  				<div className="collection followers">
            <UserList users={users} />
          </div>
  			);
  			break;
  		case 'Following':
  			return (
  				<div className="collection followers">
    				<UserList users={users} />
  				</div>
  			);
  			break;
  		default:
  			break;
  	}
  }

  render() {

  	const { posts, profile, auth } = this.props;
    if (!auth.uid) return <Redirect to='/splash' />

    return (
      <div className="container">
        <br/>
				<a className="waves-effect waves-yellow btn" href='http://localhost:8888' > Login to Spotify </a>

        {/*Profile Header block*/}
        <div className="profile-header">
        	<p className="profile-name center">{ profile.name }</p>
        </div>

        {/*navbar: mutters (Default active) | # followers | # following*/}
        <div className="btn-group">
  			<button onClick={this.handleClick} id="Mutters"><b><u>Mutters</u></b></button>
  			<button onClick={this.handleClick} id="Followers">Followers</button>
  			<button onClick={this.handleClick} id="Following">Following</button>
		</div>

    	{/*users posts (mutters), or list of users following/followers*/}
    	<div id="profile-content">
    		{this.getContent() }    	
    	</div>
      
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    posts: state.firestore.ordered.posts,
    profile: state.firebase.profile,
    auth: state.firebase.auth,
    users: state.firestore.ordered.users
  }
}


export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'posts', orderBy: ['createdAt', 'desc'] },
    { collection: 'users' }
  ])
)(Profile);
