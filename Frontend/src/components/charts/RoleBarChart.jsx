import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RoleBarChart = ({ data }) => {
  return (
    <div className="bg-white/5 p-4 rounded-xl">
      <h2 className="mb-4 font-semibold">Role Scores</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <Tooltip />
          <Bar dataKey="score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoleBarChart;