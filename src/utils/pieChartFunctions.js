import { supabase } from "../lib/supabase";

export const mobilePieChart = async ()=>{
    const { data: pieChartData, error } = await supabase.from("piechart").select("*");
    if (error) {
      console.error("Error fetching pie chart data:", error);
      return;
    }
    const findMobile = pieChartData.find((eachData)=> eachData.device =="mobile");
    if(findMobile){
      const update = findMobile.visitors+1;
      const { error: updateError } = await supabase.from("piechart").update({ visitors: update }).eq("device", "mobile");
      if (updateError) {
        console.error("Error updating mobile visitors:", updateError);
      }
    }
  }

export const desktopPieChart = async ()=>{
    const { data: pieChartData, error } = await supabase.from("piechart").select("*");
    if (error) {
      console.error("Error fetching pie chart data:", error);
      return;
    }
    const findDesktop = pieChartData.find((eachData)=> eachData.device =="desktop");
    if(findDesktop){
      const update = findDesktop.visitors+1;
      const { error: updateError } = await supabase.from("piechart").update({ visitors: update }).eq("device", "desktop");
      if (updateError) {
        console.error("Error updating desktop visitors:", updateError);
      }
    }
  }

export const tabletPieChart = async ()=>{
    const { data: pieChartData, error } = await supabase.from("piechart").select("*");
    if (error) {
      console.error("Error fetching pie chart data:", error);
      return;
    }
    const findTablet = pieChartData.find((eachData)=> eachData.device =="tablet");
    if(findTablet){
      const update = findTablet.visitors+1;
      const { error: updateError } = await supabase.from("piechart").update({ visitors: update }).eq("device", "tablet");
      if (updateError) {
        console.error("Error updating tablet visitors:", updateError);
      }
    }
  }

export const unknownPieChart = async ()=>{
    const { data: pieChartData, error } = await supabase.from("piechart").select("*");
    if (error) {
      console.error("Error fetching pie chart data:", error);
      return;
    }
    const findUnknown = pieChartData.find((eachData)=> eachData.device =="unknown");
    if(findUnknown){
      const update = findUnknown.visitors+1;
      const { error: updateError } = await supabase.from("piechart").update({ visitors: update }).eq("device", "unknown");
      if (updateError) {
        console.error("Error updating unknown visitors:", updateError);
      }
    }
  }


