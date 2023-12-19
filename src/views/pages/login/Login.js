import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from "react-helmet";
import '../landing/Landing.css';
import {
  CAlert,
  CProgress,
} from '@coreui/react'
import { API_URL } from '../../../apiConfig';
import axios from 'axios';

import GoogleOAuth from './GoogleOAuth';
import Register from '../register/Register';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import * as auth from '../../../auth/authCore';

const Login = () => {
  const history = useHistory();
  const authentication = useSelector(state => state.authentication)
  const dispatch = useDispatch()
  const [serverError, setServerError] = useState();
  const [externalData, setExternalData] = useState();
  const [displayRegister, setDisplayRegister] = useState(false);
  const [displayReturnToApp, setDisplayReturnToApp] = useState(false);

  const [loading, setLoading] = useState(false);

  let params = new URLSearchParams(useLocation().search);

  const onOAuthFailure = (error) => {
      console.log(error)
  };

  const onOAuthSuccess = async (data) => {
    setExternalData(data)
    setLoading(true)
    setServerError(null)
    try {
      var loginResponse = await axios.post(`${API_URL}/authentication/loginexternal`, data);
      setLoading(false)
      if (loginResponse.status === 200) {
        let webRedirectUrl = params.get("redirect");
        let appRedirectUrl = params.get("redirect_uri");
        if (appRedirectUrl != null) {
          let config = {
            headers: {
              Authorization: loginResponse.data.accessToken,
            }
          }
          setLoading(true)
          dispatch(auth.onAuthSuccess(loginResponse.data, false))
          await axios.post(`${appRedirectUrl}`, null, config);
          setLoading(false)
          setDisplayReturnToApp(true)
        } else {
          dispatch(auth.onAuthSuccess(loginResponse.data, false))
          history.replace(webRedirectUrl)
        }
      } else if (loginResponse.status === 202) {
        setDisplayRegister(true)
      } else {
        setServerError("Request failed, please try again.");
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
      setServerError("Request failed, please try again.");
    }
  };

  const RenderLogin = () => {
    return (
      <>
        <h1 class="mb-4">Sign In</h1>
        <GoogleOAuth onFailure={onOAuthFailure} onSuccess={onOAuthSuccess} />
        <div class="py-4" >
          {serverError ?
            <CAlert color="danger">
              {serverError}
            </CAlert>
            :
            <CAlert color="info">
              If you don't have a Google account, it only takes a few minutes to create one. We expect to add more login providers in the future.
            </CAlert>
          }
        </div>
      </>
    )
  }

  const RenderContent = () => {
    if (loading) {
      return <CProgress animated value={100} className="mb-3" />
    } else if (displayRegister) {
      return <Register onCancel={() => setDisplayRegister(false)} provider={externalData.provider} token={externalData.token} email={externalData.email} name={externalData.name} />
    } else if (displayReturnToApp) {
      return <CAlert color="success">Authentication sucessful, please return to the app.</CAlert>
    } else {
      return <RenderLogin />
    }
  }

  return (
    <>
      <Helmet>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />

        <link href="/assets/img/favicon.png" rel="icon" />
        <link href="/assets/img/apple-touch-icon.png" rel="apple-touch-icon" />

        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Dosis:300,400,500,,600,700,700i|Lato:300,300i,400,400i,700,700i" rel="stylesheet" />

        <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet" />
        <link href="/assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet" />
        <link href="/assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet" />
        <link href="/assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet" />
      </Helmet>
      <header id="header" class="fixed-top">
        <div class="container d-flex align-items-center justify-content-between">

          <a href="/" class="logo"><img src="name_and_logo255.png" alt="" class="img-fluid" /></a>

        </div>
      </header>

      <section id="hero" class="d-flex align-items-center">
        <div class="container text-center" >
          {RenderContent()}
        </div>

      </section>

      <footer id="footer">
        <div class="container py-4">
          <div class="copyright">
            &copy; Copyright © 2021 <strong><span>Theia Stream, LLC</span></strong>. All Rights Reserved
          </div>
          <div class="credits">
          </div>
        </div>
      </footer>

      <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

      <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="assets/vendor/glightbox/js/glightbox.min.js"></script>
      <script src="assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
      <script src="assets/vendor/php-email-form/validate.js"></script>
      <script src="assets/vendor/purecounter/purecounter.js"></script>
      <script src="assets/vendor/swiper/swiper-bundle.min.js"></script>

      <script src="assets/js/main.js"></script>

    </>
  )
}

export default Login
