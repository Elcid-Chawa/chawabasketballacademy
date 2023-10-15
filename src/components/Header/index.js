import React, { useState } from 'react';
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBContainer,
  MDBIcon,
  MDBCollapse,
  MDBNavbarBrand,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';

export default function Header() {
  const [showBasic, setShowBasic] = useState(false);

  return (
    <header>
      <MDBNavbar light bgColor="dark" className="p-3 text-white">
        <MDBContainer>
          <div>
            <p>
              <MDBIcon fas icon="location-dot" /> Limbe, SWR Cameroon{" "}
              <span> | </span>
              <MDBIcon fas icon="phone" /> +237 6755 389 27
            </p>
          </div>

          <div className="d-flex">
            <MDBNavbarItem>
              <MDBNavbarLink
                href="https://www.facebook.com/groups/chawabasketballacademy"
                target="_blank"
              >
                <MDBIcon fab icon="facebook-square" />
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink
                href="https://www.linkedin.com/showcase/chawas-basketball-academy"
                target="_blank"
              >
                <MDBIcon fab icon="linkedin" />
              </MDBNavbarLink>
            </MDBNavbarItem>
            <span> </span>
          </div>
        </MDBContainer>
      </MDBNavbar>
      <MDBNavbar expand="lg" light bgColor="black" height="100px">
        <MDBContainer fluid>
          <MDBNavbarBrand>
            <img src="/logo2.png" height="50" alt="" loading="lazy" />
          </MDBNavbarBrand>
          <MDBNavbarToggler
            onClick={() => setShowBasic(!showBasic)}
            aria-controls="navbarExample01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <MDBIcon fas icon="bars" className="text-white" />
          </MDBNavbarToggler>
          <MDBCollapse navbar show={showBasic}>
            <MDBNavbarNav
              right
              className="d-flex w-auto mb-2 mb-lg-0 text-white"
            >
              <MDBNavbarItem active>
                <MDBNavbarLink
                  aria-current="page"
                  href="#"
                  className="text-white"
                >
                  Home
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href="#about-us" className="text-white">
                  About
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href="#programs" className="text-white">
                  Programs
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href="#contact-us" className="text-white">
                  Contact
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <div
        className="p-5 text-left bg-image hero-image"
        style={{
          backgroundImage: "url('/images/about-back.jpg')",
          height: "500px",
        }}
      >
        <div className="mask" style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}>
          <MDBRow className="d-flex align-items-center h-100">
            <MDBCol className="text-white p-5" size="8">
              <h4>Welcome to the</h4>
              <h1 className="mb-3 text-wrap">
                <strong className="display-1">
                  Chawa's Basketball Academy (CHABA)
                </strong>
              </h1>
              <h4 className="mb-3">
                <i>Basketball Our Passion</i>
              </h4>
              <p>
                Our academy offers a variety of programs for all levels of
                players.
              </p>
            </MDBCol>
            <MDBCol
              style={{
                backgroundImage: "url('/images/athlete.jpeg')",
                height: "100%",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
              size="4"
            ></MDBCol>
          </MDBRow>
        </div>
      </div>
    </header>
  );
}