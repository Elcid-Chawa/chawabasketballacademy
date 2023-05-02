import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import React, { useState, useEffect } from "react";

const BasketballAcademy = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    // Get the programs from the API.
    fetch("/api/programs")
      .then((response) => response.json())
      .then((programs) => setPrograms(programs));
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
    <section className="about-us p-5 justify-content-center align-items-center">
    <MDBContainer>
      <MDBRow>
        <MDBCol size='4'>
          <img src='/images/founder-academy.jpeg' alt='...' fluid />
        </MDBCol>
        <MDBCol size='6'>
          <h2 id='about-us' className="text-center pt-5">About Us</h2>
          <p className="pt-5">Chawa's Basketball Academy is a recent creation of a couple, former experinced basketball players, national referees, and basketball coaches.</p>
          <p>It is their passion for this game that led them to create this academy and also the love for the Southwest Region of Cameroon where young 
          basketball players are left to themselves.</p>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    </section>
  );
};

const VisionSection = () => {
    return (
      <section className="vision p-5 justify-content-center align-items-center">
      <MDBContainer>
        <MDBRow>
          <MDBCol size='6'>
            <h2 className="text-center">Vision</h2>
            <p><strong>The initial vision </strong>of the academy is to offer kids the opportuninty to discover basketbaell.
            <br /> Our role is to accompany and train kids in their practice of basketball towards their best level.
            </p>
            <p><strong>Then main vision </strong> of our academy is to allow kids to apprehend the requirements of the sport as well on physical and technical
            aspects, as mental and behavioral, with adapted educational means.</p>
            <p><strong>Our final vision </strong> is to enhance their development and to integrate the modt talented in training centers, and professional clubs
            Africa and abroad.</p>
          </MDBCol>
          <MDBCol size='4'>
          </MDBCol>
        </MDBRow>
      </MDBContainer>  
      </section>
    );
  };

  const MissionSection = () => {
    return (
      <section className="mission p-5 text-center align-items-center">
        <h2>Mission</h2>
        <p>Firstly, to bring the knowledge and mastery of the baskeball in an extended area of the Southwest Region of Cameroon.</p>
        <p>To bring an exteernal vision of our basketball in the Southwest Region whether in Cameroon, in Africa and even in the world.</p>
      </section>
    );
  };

const ProgramsSection = ({ programs }) => {
  return (
    <section className="programs">
      <h2>Programs</h2>
      <ul>
        {programs.map((program) => (
          <li key={program.id}>
            <h3>{program.name}</h3>
            <p>{program.description}</p>
            <a href="/programs/[program.id]">Learn More</a>
          </li>
        ))}
      </ul>
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
