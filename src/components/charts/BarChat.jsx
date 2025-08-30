"use client";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { supabase } from "../../lib/supabase";
import { getMonth } from "../../utils/dataConverter";
import PropTypes from "prop-types"

const BarChart = ({getOrdersFunc}) => {
  const [loadingData, setLoadingData] = useState(false);
  const [months, setMonths] = useState({
    jan: 0,
    feb: 0,
    mar: 0,
    apr: 0,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 0,
    nov: 0,
    dec: 0,
  });

  const filterOrders = (dataTest) => {
    const monthCounts = {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    };

    dataTest.forEach((month) => {
      switch (month) {
        case 1:
          monthCounts.jan++;
          break;
        case 2:
          monthCounts.feb++;
          break;
        case 3:
          monthCounts.mar++;
          break;
        case 4:
          monthCounts.apr++;
          break;
        case 5:
          monthCounts.may++;
          break;
        case 6:
          monthCounts.jun++;
          break;
        case 7:
          monthCounts.jul++;
          break;
        case 8:
          monthCounts.aug++;
          break;
        case 9:
          monthCounts.sep++;
          break;
        case 10:
          monthCounts.oct++;
          break;
        case 11:
          monthCounts.nov++;
          break;
        case 12:
          monthCounts.dec++;
          break;
        default:
          break;
      }
    });
    setMonths(monthCounts);
  };

  // const fetchOrders = async () => {
  //   setLoadingData(true);
  //   const { data: orders, error } = await supabase.from("orders").select("*");
  //   if (error) {
  //     console.error("Error fetching orders:", error);
  //     setLoadingData(false);
  //     return;
  //   }
  //   const timeStamp = orders.map((eachOrder) =>
  //     getMonth(new Date(eachOrder.created_at).getSeconds())
  //   );
  //   filterOrders(timeStamp);
  //   setLoadingData(false);
  // };

  useEffect(() => {
    
    // fetchOrders();
  }, []);

  const options = {
    chart: {
      id: "basic-bar",
      toolbar: {
        show: false, // Hide the toolbar, including the hamburger menu
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    plotOptions: {
      bar: {
        columnWidth: "10%", // Adjust the width of the bars (10% makes them thinner)
        borderRadius: 4, // Add a slight border radius to the bars
      },
    },
    colors: [
      "#E6A960",
      "#E6A960",
      "#E6A960",
      "#E6A960",
      "#E6A960",
      "#E6A960",
      "#E6A960",
      "#E6A960",
      "#E6A960",
      "#E6A960",
      "#E6A960",
      "#E6A960",
    ], // Set colors for the bars
    grid: {
      show: false, // Hide the chart's grid lines and baseline
    },
    dataLabels: {
      enabled: false, // Hide data labels on top of the bars
    },
  };

  const series = [
    {
      name: "Amount",
      data: [
        months.jan,
        months.feb,
        months.mar,
        months.apr,
        months.may,
        months.jun,
        months.jul,
        months.aug,
        months.sep,
        months.oct,
        months.nov,
        months.dec,
      ],
    },
  ];

  return (
    <>
      {loadingData ? (
        <p>Loading the Admin BarChart</p>
      ) : (
        <ReactApexChart
          className={"w-full"}
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      )}
    </>
  );
};



export default BarChart;