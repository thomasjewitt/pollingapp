import {Paper, Container, Grid, Typography} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';


export function PollResults() {

    const { id } = useParams();
    const [pollData, setPollData] = useState();
    ChartJS.register(ArcElement, Tooltip, Legend);



    useEffect(() => {
        async function callAPI() {
            const response = await fetch(`/api/polls/${id}/`, {
                method: 'GET'
            });
            const data = await response.json();
            const options = data["options"].map((option) => {return option["option"]});
            const responses = [];

            for (const option of options) {
                const votes = data["responses"].reduce((sum, item) => {
                    const selectedOptions = item["options"].map((selectedOption) => {return selectedOption["option"]});
                    if (selectedOptions.includes(option)) {
                        return sum = sum + 1;
                    } else {
                        return sum;
                    }
                }, 0);
                responses.push(votes);
            }

            let chartData = {
                labels: options,
                datasets: [
                    {
                        label: '# of Votes',
                        data: responses,
                        backgroundColor: [
                            'rgba(255, 0, 0, 1)',
                            'rgba(0, 255, 0, 1)',
                            'rgba(0, 0, 255, 1)',
                            'rgba(255, 255, 0, 1)',
                            'rgba(255, 0, 255, 1)',
                            'rgba(0, 255, 255, 1)',
                            'rgba(150, 75, 50, 1)',
                            'rgba(50, 75, 150, 1)'
                          ],
                    }
                ]
            }

            data["chartData"] = chartData;
            setPollData(data);
        }
        callAPI();
    }, [])


    return (<Container>
        <Paper>
            {pollData && <Grid container display="flex" justifyContent="center">
                <Grid item xs={4}>
                    <Typography align="center" variant='h2'>{pollData["question"]}</Typography>
                    <Pie data={pollData["chartData"]} /> 
                </Grid>
            </Grid>
            }
        </Paper>
    </Container>)
}