import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Box, Button, Container, Paper, Typography, Grid, Checkbox, Radio, TextField } from "@material-ui/core";

export function Poll() {
    const { id } = useParams();
    const [pollData, setPollData] = useState();
    const [selections, setSelections] = useState([]);

    useEffect(() => {
        async function callAPI() {
            const response = await fetch(`/api/polls/${id}/`, {
                method: 'GET'
            });
            const data = await response.json();
            setPollData(data);
        }
        callAPI();
    }, []);

    function handleRadioSelect(optionId) {
        setSelections([optionId]);
    }

    function handleCheckSelect(optionId) {
        let newSelections = selections;
        if (selections.includes(optionId)) {
            newSelections = selections.filter((option) => {return option !== optionId});
        } else {
            newSelections = [...selections, optionId];
        }
        setSelections(newSelections);
    }

    async function handleSubmit() {
        const cleanedSelections = selections.map((selection) => {return {"id": selection}});
        const dataToSend = {"options": cleanedSelections};
        console.log(dataToSend);
        const response = await fetch(`/api/polls/${id}/respond/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });
        const data = await response.json();
        window.location.replace(`/poll/${id}/results/`);
    }

    return !pollData ? null : (
    <Container>
        <Paper>
            <Box display="flex" justifyContent="center">
                <Typography variant="h4">{pollData["question"]}</Typography>
            </Box>
            <Grid container justifyContent="center">
                <Grid item xs={8} container>
                    {pollData["options"].map((option) => {
                        return (<React.Fragment>
                            <Grid item xs={8} justifyContent="center">
                                <Box sx={{display: "flex", alignItems: "center"}}>
                                    <Typography align="center" variant="body1">{option["option"]}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                {pollData["multiple_choice"] ? 
                                    <Checkbox 
                                        value={option["id"]}
                                        checked={selections.includes(option["id"])}
                                        onChange={(e) => {handleCheckSelect(e.target.value)}}/> : 
                                    <Radio 
                                        value={option["id"]}
                                        checked={selections[0] === option["id"]}
                                        onChange={(e) => {handleRadioSelect(e.target.value)}}/>
                                }
                            </Grid>
                        </React.Fragment>);
                    })}
                </Grid>
            </Grid>
            <Grid container justifyContent="center">
                <Button onClick={handleSubmit}>Submit Response</Button>
            </Grid>
            <Grid container justifyContent="center">
                <Typography variant="body1">Share: </Typography>
                <Box sx={{width: "30vw"}}>
                    <TextField 
                        fullWidth 
                        InputProps={{readOnly: true}} 
                        defaultValue={window.location.href}/>
                </Box>
            </Grid>
        </Paper>
    </Container>);
}