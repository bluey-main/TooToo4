export const dateConverter = (date)=>{
    const testDate = date*1000
    const dateConverted = new Date(testDate);
    return dateConverted.toLocaleDateString()
}

export const convertDate = (date) => {
    let dateConverted;
    if (typeof date === "string") {
        dateConverted = new Date(date);
    } else {
        dateConverted = new Date(date * 1000);
    }
    return dateConverted.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
export const getMonth = (month)=>{
    const test = month*1000;
    const dateConverted = new Date(test);
    return dateConverted.getMonth()+1;
}
