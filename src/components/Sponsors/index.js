import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";

export default function Sponsors(){
    return(
        <section className="fluid p-4 bg-dark bg-gradient">
        <h3 className="text-white">In Collaboration with:</h3>      
            <MDBContainer >
                <MDBRow className="d-flex justify-content-center align-items-center">
                    
                    <MDBCol size='2'>
                    <img
                        src='/images/Chawex.png'
                        className="img rounded-pill"
                        alt='...'
                        width='50%'
                    />
                    </MDBCol>
                    <MDBCol size='2'>
                        <img
                            src='/images/holidayinn.png'
                            className="img rounded-pill"
                            alt='...'
                            width='50%'
                        />
                    </MDBCol>
                    <MDBCol size='2'>
                        <img
                            src='/images/swrllogo.jpeg'
                            className="img rounded-pill"
                            alt='...'
                            width='50%'
                        />
                    </MDBCol>
                    <MDBCol size='2'>
                        <img
                            src='/logo2.png'
                            className="img rounded-pill"
                            alt='...'
                            width='50%' 
                        />
                    </MDBCol>
                    <MDBCol size='2'>
                        <img
                            src='/logo2.png'
                            className="img rounded-pill"
                            alt='...'
                            width="50%"
                        />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}