export const dateConverter = (date)=>{
    const testDate = date*1000
    const dateConverted = new Date(testDate);
    return dateConverted.toLocaleDateString()
}

export const convertDate = (date)=>{
    const testDate = date*1000
    const dateConverted = new Date(testDate);
    return dateConverted.toDateString("en-US", { month: "long", year: "numeric" }); 
}

export const getMonth = (month)=>{
    const test = month*1000;
    const dateConverted = new Date(test);
    return dateConverted.getMonth()+1;
}

