import BarChart from "../../charts/BarCharts"

const Dashboard = () => {
  return (
    <div className="mt-5 ml-16">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <BarChart/>
      </div>
    </div>
  )
}

export default Dashboard