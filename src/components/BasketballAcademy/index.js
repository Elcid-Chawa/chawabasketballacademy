import { 
  MDBRow, 
  MDBCol, 
  MDBTypography,
  MDBIcon, 
  MDBCard, MDBCardBody, MDBCardText, MDBCardLink, MDBCardHeader 
} from "mdb-react-ui-kit";
import React, { useState, useEffect } from "react";
import data from "./api/programs.json"
import './style.css'

const BasketballAcademy = () => {
  const [programs, setProgra] = useState([]);

  useEffect(() => {
    // Get the programs from the API.
    fetch("./api/programs.json")
      .then((response) => response.json())
      .then((programs) => setProgra(programs));
  }, []);

  return (
    <div>
      <AboutUsSection />
      <VisionSection />
      <MissionSection />
      <ProgramsSection programs={programs} />
      <TestimonialsSection />
    </div>
  );
};

const AboutUsSection = () => {
  return (
    <MDBRow className="about-style about-us text-white mt-0">
      <MDBCol size="6" sm="6" className="about-col">
        <MDBTypography
          className=""
          style={{ paddingLeft: "2em" }}
        >
          Founder
          Elcid Chawa
        </MDBTypography>
      </MDBCol>
      <MDBCol sm ="6"  className="">
        <MDBTypography className="lead">
          <h1 id="about-us" className="text-left display-2">
            About Us
          </h1>
          <strong className="display-4">Chawa's Basketball Academy</strong> is a
          recent creation of a couple, former experinced basketball players,
          national referees, and basketball coaches. It is their passion for
          this game that led them to create this academy and also the love for
          the Southwest Region of Cameroon where young basketball players are
          left to themselves. Most of thm have no one to teach them the basics
          of Basketball.
        </MDBTypography>
      </MDBCol>
    </MDBRow>
  );
};

const VisionSection = () => {
    return (
      <MDBRow className="vision-style  mt-1 h-100">
          <MDBCol size="3" sm="3" className="p-5"
            style={{backgroundImage: "linear-gradient(140deg, #280238 45%, #e49c16 20%)"}}
          >
            <h1 className="text-white">Vision</h1></MDBCol>
          <MDBCol size='7' sm="6" className="p-5">
            
            <MDBTypography listUnStyled className='mb-0'
              style={{color: "#280238"}}
            >
              <li className="mb-3">
                <p>
                <MDBIcon icon='long-arrow-alt-right me-2' />
                <strong>The initial vision </strong>of the academy is to offer kids the opportuninty to discover basketball.
                <br /> Our role is to accompany and train kids in their practice of basketball towards their best level.
                </p>
              </li>
              <li className="mb-3">
                <p>
                <MDBIcon icon='long-arrow-alt-right me-2' />
                <strong>Then main vision </strong> of our academy is to allow kids to apprehend the requirements of the sport as well on physical and technical
                aspects, as mental and behavioral, with adapted educational means.</p>
              </li>
              <li className="mb-1">
                <p>
                <MDBIcon icon='long-arrow-alt-right me-2' />
                <strong>Our final vision </strong> is to enhance their development and to integrate the mos t talented in training centers, and professional clubs
                Africa and abroad.</p>
              </li>
            </MDBTypography>
            
          </MDBCol>
          
      </MDBRow> 
    );
  };

  const MissionSection = () => {
    return (
        <MDBRow className="d-flex mt-1">
          <MDBCol md="6" className="text-white mission-style p-5">
              <h1 >Mission</h1>
              <MDBTypography className="lead">Firstly, to bring the knowledge and mastery of the baskeball in an extended area of the Southwest Region of Cameroon.</MDBTypography>
              <MDBTypography className="lead">To bring an external vision of our basketball in the Southwest Region whether in Cameroon, in Africa and even in the world.</MDBTypography>
          </MDBCol>
          <MDBCol md="6" className="p-3 mission-style-c2">
            <img src='/images/players.jpeg' alt='...' fluid className="img" />
          </MDBCol>
        </MDBRow>
    );
  };

const ProgramsSection = ({ programs }) => {
  return (
    <section >
      <MDBRow
        style={{ 
          backgroundImage: "url('/images/girlsstreatch.jpeg')",
          backgroundPositionX: "center",
          backgroundPositionY:"center",
          backgroundSize: "cover",
          backgroundRepeat:"no-repeat",
          height: "40em"
        }}
        className="programs justify-content-center align-items-center text-center"
        id="programs"
      >

          <MDBCol size="12"
          style={{
            backgroundColor: "rgba(28, 02, 38, 0.9)",
            height:"50%"
          }}
            className="justify-content-center align-items-center"
          >
            <MDBTypography tag="div" className="display-6 text-white">Chawa's Basketball Academy </MDBTypography>
          </MDBCol>
       
        
      </MDBRow>
      <h1>Programs</h1>
      <ul>
        {programs.map((program) => (
          <li key={program.id}>
            <h3>{program.name}</h3>
            <p>{program.description}</p>
            <a href="file://localhost/programs/[program.id]">Learn More</a>
          </li>
        ))}
      </ul>
      <MDBRow>
        {data.map((d, index) =>  (
          <MDBCol md='3'>
            <MDBCard key={index} alignment='center'>
              <MDBCardHeader>{d.name}</MDBCardHeader>
              <MDBCardBody>
                <MDBCardText>{d.description}</MDBCardText>
                <MDBCardLink href="file://localhost/programs/[data.id]">More</MDBCardLink>
              </MDBCardBody>
              
            </MDBCard>
          </MDBCol>
          ))}
      </MDBRow>
    </section>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="testimonials">
      <h2>Testimonials</h2>
      <blockquote>
        <p>"I've learned so much from the coaches at this academy. They've helped me improve my skills and confidence."</p>
        <footer>- John Smith</footer>
      </blockquote>
      <blockquote>
        <p>"This academy is the best! The coaches are great and the facilities are top-notch."</p>
        <footer>- Jane Doe</footer>
      </blockquote>
    </section>
  );
};

export default BasketballAcademy;
