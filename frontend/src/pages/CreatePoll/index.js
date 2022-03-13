import { Container, TextField, Paper, Grid, Box, Button, Typography, Switch } from "@material-ui/core";
import { useState } from "react";

export function CreatePoll() {

    const [question, setQuestion] = useState([""]);
    const [options, setOptions] = useState([""]);
    const [multipleChoice, setMultipleChoice] = useState(false);

    function handleRemove(index) {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    }

    function handleAdd() {
        setOptions([...options, ""]);
    }

    function handleChangeQuestion(e) {
        setQuestion(e.target.value);
    }

    function handleChangeOption(e, index) {
        const newOptions = [...options];
        newOptions[index] = e.target.value;
        setOptions(newOptions);
    }

    async function handleSubmit() {
        const response = await fetch("/api/polls/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"question": question, "options": options.map((option) => {return {"option": option}}), "multiple_choice": multipleChoice})
        });
        const data = await response.json();
        window.location.replace(`/poll/${data["id"]}`);
    }

    return (
        <Container>
            <Paper>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center">
                        <Typography variant="body1">Multiple Choice </Typography>
                        <Switch 
                            checked={multipleChoice}
                            onChange={() => setMultipleChoice(!multipleChoice)}/>
                </Box>
                <Grid 
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}>
                    <Grid item xs={7}>
                        <Box mt={2}>
                            <TextField fullWidth
                                multiline
                                rows={3}
                                label="Question"
                                variant="outlined"
                                value={question}
                                onChange={(event) => handleChangeQuestion(event)}
                                />
                        </Box>
                    </Grid>
                </Grid>
                {   options &&
                    options.map((option, index) => {
                        return (
                        <Grid container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}>
                            <Grid item xs={6}>
                                <Box mt={1} mb={1}>
                                    <TextField fullWidth 
                                        label={"Option " + (index + 1)} 
                                        variant={"outlined"}
                                        value={option}
                                        onChange={(event) => {handleChangeOption(event, index)}}
                                        />
                                </Box>
                            </Grid>
                            <Grid item xs={1}>
                                <Button 
                                variant="contained"
                                onClick={() => {handleRemove(index)}}>
                                    X
                                </Button>
                            </Grid>
                        </Grid>
                        )  
                    })
                }
                <Box mb={2}>
                    <Grid container justifyContent="center">
                        {(options.length < 8) ? 
                        <Grid item xs={2}>
                            <Button 
                                fullWidth
                                onClick={handleAdd}>Add Option</Button>
                        </Grid> :
                        <Grid item xs={2}>
                        </Grid>}
                        {(options.length > 0) &&
                            <Grid item xs={2}>
                                <Button 
                                    fullWidth
                                    onClick={handleSubmit}>Create Poll</Button>
                            </Grid>
                        }
                    </Grid>
                </Box>
            </Paper>
        </Container>
    )
}