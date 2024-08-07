import * as React from "react";

import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { formContext } from "./App";
// const context = React.useContext(formContext);
// const data = [
//     { label: "Group A", value: 400, color: "#0088FE" },
//     { label: "Group B", value: 300, color: "#00C49F" },
//     { label: "Group C", value: 300, color: "#FFBB28" },
//     { label: "Group D", value: 200, color: "#FF8042" },
// ];
// const [data, setData] = React.useState(context.allExpenses);

export default function PieChartForExpenses() {
    const context = React.useContext(formContext);
    const [data, setData] = React.useState(context.allExpenses);
    React.useEffect(() => {
        setData(context.allExpenses);
    }, [context.allExpenses]);
    const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);
    const getArcLabel = (params) => {
        const percent = params.value / TOTAL;
        return `${(percent * 100).toFixed(0)}%`;
    };
    const sizing = {
        margin: { right: 5 },
        width: 200,
        height: 200,
        legend: { hidden: true },
    };
    return (
        // <PieChart
        //     series={[
        //         {
        //             outerRadius: 80,
        //             data,
        //             arcLabel: getArcLabel,
        //         },
        //     ]}
        //     sx={{
        //         [`& .${pieArcLabelClasses.root}`]: {
        //             fill: "white",
        //             fontSize: 14,
        //         },
        //     }}
        //     {...sizing}
        // />
        <div>
            <PieChart
                series={[
                    {
                        data: data,
                    },
                ]}
                margin={{ left: -50 }}
                width={450}
                height={200}
            />
        </div>
    );
}
