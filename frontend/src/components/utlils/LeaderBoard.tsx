import React from 'react';



const Leaderboard = ({leaderboard}:any) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">Leaderboard</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Rank</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Time (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard&&leaderboard.map((user:any, index:number) => (
            <tr key={index} className="border-b hover:bg-gray-100">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
