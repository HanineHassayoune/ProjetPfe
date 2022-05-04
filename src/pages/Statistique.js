import React from "react";
//import Paper from "@material-ui/core/Paper";
import Paper from "@mui/material/Paper";
import {
  Chart,
  PieSeries,
  Title,
} from "@devexpress/dx-react-chart-material-ui";
import {
  ArgumentAxis,
  ValueAxis,
  BarSeries,
} from "@devexpress/dx-react-chart-material-ui";
import { Grid } from "@mui/material";

const Statistique = () => {
  // Sample data
  const data = [
    { argument: "Lundi", value: 10 },
    { argument: "Mardi", value: 10 },
    { argument: "Mercredi", value: 10 },
    { argument: "Jeudi", value: 20 },
    { argument: "Vendredi", value: 10 },
    { argument: "Samedi", value: 10 },
    { argument: "Dimanche", value: 20 },
  ];
  const _data = [
    { argument: "Monday", value: 30 },
    { argument: "Tuesday", value: 20 },
    { argument: "Wednesday", value: 10 },
    { argument: "Thursday", value: 50 },
    { argument: "Friday", value: 60 },
  ];
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3}>
            <Chart data={data}>
              <PieSeries valueField="value" argumentField="argument" />
              <Title text="Articles par jour " />
            </Chart>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3}>
            <Chart data={_data}>
              <ArgumentAxis />
              <ValueAxis />
              <BarSeries valueField="value" argumentField="argument" />
            </Chart>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Statistique;
