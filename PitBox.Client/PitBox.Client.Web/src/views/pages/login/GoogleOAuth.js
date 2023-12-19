import React from 'react'
import GoogleLogin from 'react-google-login'

//todo: move to config
const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID

const GoogleOAuth = (props) => {
    const onFailure = (error) => {
        props.onFailure(error)
    };

    const googleResponse = (response) => {
        var data = { provider: 'google', token: response.tokenId, email: response.profileObj.email, name: response.profileObj.name }
        props.onSuccess(data)
    };

    return (
        <GoogleLogin
            theme="dark"
            buttonText="Continue with Google"
            clientId={clientId}
            onSuccess={googleResponse}
            onFailure={onFailure}
        />
    )
}

export default GoogleOAuth
