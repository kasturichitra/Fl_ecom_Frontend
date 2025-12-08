import CommonPieChart from "../CommonPieChart.jsx";



const TopBrands=()=>{
      const colors = ["#a78bfa", "#60a5fa", "#93c5fd", "#6ee7b7", "#f87171", "#fb923c"];

    return(
        <CommonPieChart
        title="Top Brands"
        labels={""}
        counts={100}
        stats={""}
        colors={colors}
        />
    )
}



export default TopBrands
