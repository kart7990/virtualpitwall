import React from 'react'
import { Helmet } from "react-helmet";
import './Landing.css';
import {
    CAlert
} from '@coreui/react'
import { brandSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react';

const Landing = () => {
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

                    <nav id="navbar" class="navbar">
                        <ul>
                            <li><a class="nav-link scrollto" href="/home">Sign In</a></li>
                        </ul>
                        <i class="bi bi-list mobile-nav-toggle"></i>
                    </nav>

                </div>
            </header>

            <section id="hero" class="d-flex align-items-center">
                <div class="container" >
                    <div class="row">
                        <div class="col-lg-6 pt-4 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center">
                            <h1>The realtime web-based race dashboard for iRacing</h1>
                            <h2>
                                The virtual pitbox platform displays all relevant race event data directly to a web-based dashboard.
                                Designed for collaborative racing events where a race engineer can give your team the edge over the competition.
                                Simply give the dashboard link to anyone you wish to share with, all they need is a modern web browser!
                            </h2>
                            <div><a href="/home" class="btn-get-started scrollto">Get Started</a></div>
                        </div>
                        <div class="col-lg-6 order-1 order-lg-2 hero-img">
                            <img src="generic_monitor_dashboard.png" class="img-fluid" alt="" />
                        </div>
                    </div>
                    <div class="row py-4" >
                        <div class="col-lg-12">
                            <CAlert color="warning">
                                The virtual pitbox platform is currently in beta. We are excited to share our progress with the community, but do not expect a bug-free or polished experience.
                                There will be issues and some features may not work entirely. Please report any issues or feature requests so we can build something awesome together.
                            </CAlert>
                        </div>
                    </div>
                </div>

            </section>

            <footer id="footer">
                <div class="container py-4">
                    <div class="copyright">
                        Copyright © 2021 <strong><span>Theia Stream, LLC</span></strong>. All Rights Reserved
                    </div>
                    <div class="credits">
                        <a href="https://discord.gg/RcMX8FN2G2" target="_blank">
                            <CIcon content={brandSet.cibDiscord} style={{color: '#fff'}} size="2xl" />
                        </a>
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

export default Landing
