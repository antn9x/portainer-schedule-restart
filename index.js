const cron = require('node-cron');
const axios = require("axios");

const username = process.env.PORTAINER_USER
const password = process.env.PORTAINER_PASSWORD
const host = process.env.PORTAINER_HOST
const stackId = process.env.PORTAINER_STACK_ID
const containersList = process.env.CONTAINERS_LIST
const schedule = process.env.SCHEDULE

async function restart(stackId, containerId) {
  axios.defaults.baseURL = host;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  const auth = await axios.post('/auth', { username, password })
  // console.log(auth.data)
  axios.defaults.headers.common.Authorization = `Bearer ${auth.data.jwt}`;
  const rs = await axios.post(`/endpoints/${stackId}/docker/containers/${containerId}/restart`)
  console.log('rsContainer', rs.data)
}

function createCron(containerId) {
  cron.schedule(schedule, () => {
    restart(stackId, containerId)
  });
}

function startSchedule() {
  containersList.split(',').forEach(createCron);
}

startSchedule();
