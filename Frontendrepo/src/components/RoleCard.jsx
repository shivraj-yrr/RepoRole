const RoleCard = ({ role }) => {
  return (
    <div className="bg-white/5 p-4 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold">{role.name}</h2>

      <div className="w-full bg-gray-700 h-3 rounded mt-2">
        <div
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded"
          style={{ width: `${role.score}%` }}
        />
      </div>

      <p className="text-sm text-gray-400 mt-2">
        Score: {role.score}%
      </p>
    </div>
  );
};

export default RoleCard;