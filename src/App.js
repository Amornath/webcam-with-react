import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button, Container, Form, Row, Col, Image } from "react-bootstrap";

function App() {
  const webcamRef = useRef(null);
  const webcamRef2 = useRef(null);
  const [webcam1, setWebcam1] = useState(true);
  const [webcam2, setWebcam2] = useState(false);
  const [imgSrc, setImgSrc] = useState({ img: "", cardNo: "" });
  const [signature, setSignature] = useState({ sign: "" });
  const [data, setData] = useState("");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc({ img: imageSrc });
  }, [webcamRef, setImgSrc]);

  const capture2 = useCallback(() => {
    const imageSrc = webcamRef2.current.getScreenshot();
    setSignature({ sign: imageSrc });
  }, [webcamRef2, setSignature]);

  const videoConstraints = {
    height: 1080, //set pic resolution
    width: 1920, //set pic resolution
    facingMode: "user",
  };

  const savePhoto = async (e) => {
    e.preventDefault();
    fetch(
      " http://localhost:8000/employee?" +
        new URLSearchParams({
          cardNo: data,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        if (data[0]) {
          imgSrc.cardNo = data[0].cardNo;
          imgSrc.sign = signature.sign;
          fetch("http://localhost:8000/IMG", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(imgSrc),
          }).then(() => {
            alert("data saved");
          });
        } else {
          alert("CardNo Not Exist");
        }
      });
  };

  return (
    <Container>
      <Row className="mb-3 mt-3">
        <Col className="border border-2">
          {webcam1 && (
            <Webcam
              audio={false}
              width={540}
              height={310}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          )}
          {webcam2 && (
            <Webcam
              audio={false}
              width={540}
              height={310}
              ref={webcamRef2}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          )}
        </Col>
        <Col>
          {imgSrc.img && (
            <Image
              src={imgSrc.img}
              alt="Screenshot"
              className="h-100 w-100 img-thumbnail"
            />
          )}
        </Col>
        <Col>
          {signature.sign && (
            <Image
              src={signature.sign}
              alt="Screenshot"
              className="h-100 w-100 img-thumbnail"
            />
          )}
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          {webcam1 ? (
            <Button onClick={capture} className="me-2">
              Capture photo
            </Button>
          ) : (
            <Button
              onClick={() => {
                setWebcam1(true);
                setWebcam2(false);
              }}
              className="me-2"
            >
              take photo
            </Button>
          )}

          {webcam2 ? (
            <Button onClick={capture2}>Capture signature</Button>
          ) : (
            <Button
              onClick={() => {
                setWebcam1(false);
                setWebcam2(true);
              }}
            >
              take signature
            </Button>
          )}
        </Col>
      </Row>

      <Row>
        <Form onSubmit={savePhoto} method="POST">
          <Form.Group className="mb-3">
            <Form.Label>Enter CardNo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Card No"
              name="cardNo"
              onChange={(e) => {
                setData(e.target.value);
              }}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Row>
    </Container>
  );
}

export default App;
