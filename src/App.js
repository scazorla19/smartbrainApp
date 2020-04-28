import React, { Fragment, Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImgForm from './components/ImgForm/ImgForm';
import FaceRecog from './components/FaceRecog/FaceRecog';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    shape: {
      type: 'edge'
    },
    opacity: {
      value: 0.5,      
      anim: {
        speed: 2,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        speed: 40,
        size_min: 0.1
      }
    },
    move: {
      enable: true,
      speed: 3,
      random: true
    }
  }
}

const cApp = new Clarifai.App({
  apiKey: '2977680ad7554fba8248bc5c4701c9ad'
})

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    cApp.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <Fragment>
        <div className="App">
          <Particles className="Particles" params={particlesOptions} />
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
          <Logo />
          { route === 'home'
            ? <div>                
                <Rank />
                <ImgForm 
                  onInputChange={this.onInputChange} 
                  onButtonSubmit={this.onButtonSubmit} 
                />
                <FaceRecog box={box} imageURL={imageURL} />
              </div>
            : (
              route === 'signin' || route === 'signout'
              ? <Signin onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />
            )              
          }
        </div>
      </Fragment>
    );
  }
}

export default App;
