import axios from "axios"
import { screenshotAndDownloadCSV } from "./worker.js"


export async function doLogin() {
  try {
    const response = await axios.post("http://localhost:8088/api/v1/security/login", {
      username: "rifqitama",
      password: "rifqi12",
      provider: "db",
      refresh: true
    })
  
    return response.data
  } catch(error) {
    return null
  }
}

export async function getAllDashboard(token) {
  try {
    const response = await axios.get("http://localhost:8088/api/v1/dashboard", {
      headers: { Authorization: `Bearer ${token}`, Cookie: 'session=.eJwlzktqBDEMRdG9eJyBLcmW3JspZH1ISJGGqmQUeu8xZPgeHLi_5cgr7vfySD3veCvHh5dHcW_RhXjUacli2L2BQnQgokkWslQJhmTt3YSCDMXYQgWBHcgH9qC2VDIMmUzEDDKA1PryiZFVZ8MVRo7K06Az6tLE2YLKDvm54_qv6bi33Vce38_P-NpP9tUYzJ1qiyHYBNeAYETixLGmzQaodbvzaXrGNhu-_gBb3ERg.ZmfyBA.IuFNq8bN7GwCUz89uOVtktrpLXc'}
    })
  
    return response.data
  } catch(error) {
    return null
  }
}

export async function getChartDashboard(token, dashboardId) {
  try {
    const response = await axios.get(`http://localhost:8088/api/v1/dashboard/${dashboardId}/charts`, {
      headers: { Authorization: `Bearer ${token}`, Cookie: 'session=.eJwlzktqBDEMRdG9eJyBLcmW3JspZH1ISJGGqmQUeu8xZPgeHLi_5cgr7vfySD3veCvHh5dHcW_RhXjUacli2L2BQnQgokkWslQJhmTt3YSCDMXYQgWBHcgH9qC2VDIMmUzEDDKA1PryiZFVZ8MVRo7K06Az6tLE2YLKDvm54_qv6bi33Vce38_P-NpP9tUYzJ1qiyHYBNeAYETixLGmzQaodbvzaXrGNhu-_gBb3ERg.ZmfyBA.IuFNq8bN7GwCUz89uOVtktrpLXc'}
    })
  
    return response.data
  } catch(error) {
    return null
  }
}

export async function getChart(token, chartId) {
  try {
    const response = await axios.get(`http://localhost:8088/api/v1/chart/${chartId}`, {
      headers: { Authorization: `Bearer ${token}`}
    })
  
    return response.data
  } catch(error) {
    return null
  }
}

const loginData = await doLogin()

const dashboards = await getAllDashboard(loginData.access_token)


let data = []

for(let i = 0; i < dashboards.count; i++) {
  const id = dashboards.result[i]?.id

  const charts = await getChartDashboard(loginData.access_token, id)


  const dataChart = []

  for(let j = 0; j <= charts.result.length - 1; j++) {
    dataChart.push({
      chartId: charts.result[j].id,
      chartName: charts.result[j].slice_name,
      chartUrl: charts.result[j].slice_url
    })

    console.log("Indeks i:", i)
    console.log("indeks j", j)
    await screenshotAndDownloadCSV(`http://localhost:8088${charts.result[j].slice_url}`)
  }

  data.push({
    dashboardId: id,
    dataChart
  })
}

