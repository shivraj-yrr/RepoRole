import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RolePieChart = ({ data }) => {
  return (
    <div className="bg-white/5 p-4 rounded-xl">
      <h2 className="mb-4 font-semibold">Role Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="score" nameKey="name" />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RolePieChart;