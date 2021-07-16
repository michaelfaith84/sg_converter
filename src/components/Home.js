import React, { useState, useEffect } from 'react';
import { Container, Card, InputGroup, FormControl, Spinner } from "react-bootstrap";
import DownloadLink  from "./DownloadLink"
const parse = require('csv-parse')
const ObjectsToCsv = require('objects-to-csv');

const csvInName = (filename) => {
    if (filename.match(/\.[cC][sS][vV]$/)) { return true }
    else { return false }
}

const Home = () => {
    const [filename, setFilename] = useState("")
    const [status, setStatus] = useState("Waiting for file...")
    const [showLink, setShowLink] = useState(false)
    const [url, setURL] = useState(null)

    useEffect(() => {
        if (filename !== "") {
            setStatus(<Spinner animation="border" variant="warning" />)
        } else { setStatus("Waiting for file..."); setShowLink(false)}
    }, [filename, url])

    const readCSV = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = (e) => {
            let text = (e.target.result)
            text = text.replace(/["]/g, "")
            text = text.replace(/[,]/g, ".")
            text = text.split("\r\n")
            text[0] = text[0].split(';')
            text[0].pop()
            const keys = text[0]
            keys[11] = "Value 2"
            keys[12] = "Unit 2"
            keys[13] = "Alpha 2"
            keys[7] = "Unit 3"
            text[0] = text[0].join(";")
            text = text.join("\r\n")
            parse(text, {
                delimiter: ";",
                columns: keys,
            }, async function(err, output){
                if (err) {
                    console.log(err)
                } else {
                    let arr = []
                    output.map((r) => {
                        arr.push({
                            MeasNo: r.MeasNo,
                            Date: r.Date,
                            Time: r.Time,
                            Method: r.Method,
                            "Sample ID": r['Sample ID'],
                            "Measured Parameter 1": r['Measured Parameter 1'],
                            Value: r.Value,
                            Offset: r.Offset,
                            Alpha: r.Alpha,
                            Temperature: r.Temperature,
                            Unit: r.Unit,
                        })
                    })
                    const csv = new ObjectsToCsv(arr)
                    const blob = new Blob(["\ufeff", await csv.toString()]);
                    setURL(URL.createObjectURL(blob));
                    setShowLink(true)
                }
            })
        };
        reader.readAsText(e.target.files[0])
    }

    const onChange = (e) => {
        if (csvInName(e.target.value)) {
            const value = e.target.value
            setFilename(value)
            readCSV(e)
        }
        else { setFilename("")}
    }

    return (
        <Container className="align-items-center h-100 d-flex">
            <Card className="col-6 offset-3 align-middle mb-5">
                <Card.Header className="h3">Select CSV</Card.Header>
                <Card.Body>
                    <InputGroup>
                        <FormControl
                            type="File"
                            placeholder="Filename"
                            aria-label="Filename"
                            aria-describedby="basic-addon1"
                            size="lg"
                            value={filename}
                            onChange={(e) => {
                                onChange(e)
                            }}
                        />

                        <InputGroup.Text id="basic-addon1">
                            <i className="fas fa-file-csv fa-2x"></i>
                        </InputGroup.Text>
                    </InputGroup>
                </Card.Body>
                <Card.Footer className="d-flex flex-row-reverse">{ showLink ? <DownloadLink props={{ showLink, url }} /> : status }</Card.Footer>
            </Card>
        </Container>
    );
}

export default Home