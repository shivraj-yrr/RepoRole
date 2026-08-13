import { useLocation } from "react-router-dom";
import RoleCard from "../components/RoleCard";

const Result = () => {
  const { state } = useLocation();

  if (!state) return <p>No Data</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analysis Result</h1>

      <div className="grid gap-4">
        {state.roles.map((role, i) => (
          <RoleCard key={i} role={role} />
        ))}
      </div>
    </div>
  );
};

export default Result;