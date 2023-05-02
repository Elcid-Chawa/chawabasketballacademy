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
  MDBBtn,
  MDBNavbarBrand
} from 'mdb-react-ui-kit';

export default function Header() {
  const [showBasic, setShowBasic] = useState(false);

  return (
    <header>
      <MDBNavbar expand='lg' light bgColor='black'>
        <MDBContainer fluid>
          <MDBNavbarBrand>
            <img
              src='/logo2.png'
              height='50'
              alt=''
              loading='lazy' 
            />
          </MDBNavbarBrand>
          <MDBNavbarToggler
            onClick={() => setShowBasic(!showBasic)}
            aria-controls='navbarExample01'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <MDBIcon fas icon='bars' className='text-white' />
          </MDBNavbarToggler>
          <MDBCollapse navbar show={showBasic}>
            <MDBNavbarNav right className='mb-2 mb-lg-0 text-white'>
              <MDBNavbarItem active>
                <MDBNavbarLink aria-current='page' href='#' className='text-white'>
                  Home
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href='#about-us' className='text-white'>About</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href='#programs' className='text-white'>Programs</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href='#contact-us' className='text-white'>Contact</MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <div
        className='p-5 text-center bg-image'
        style={{ backgroundImage: "url('/images/ChawasBasketballAcademy.png')", height: '500px' }}
      >
        <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
          <div className='d-flex justify-content-center align-items-center h-100'>
            <div className='text-white'>
              <h1 className='mb-3'>Chawa's Basketball Academy (CHABA)</h1>
              <h4 className="mb-3"><i>Basketball Our Passion</i></h4>
              <p>Our academy offers a variety of programs for all levels of players.</p>
              <MDBBtn tag="a" outline size="lg">
                Call to action
              </MDBBtn>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}