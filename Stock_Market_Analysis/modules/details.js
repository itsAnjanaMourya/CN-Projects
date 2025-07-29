import { fetchProfileData } from './api.js';

export async function renderDetails(symbol, stock) {
  const container = document.getElementById('details-section');
  const data = await fetchProfileData();
  console.log("data", data)
  const profileObject = data[0];

  console.log(profileObject)
  const profile = profileObject[symbol];

  console.log("stock in details", stock)
  container.innerHTML = `
    <p>${profile.summary}</p>
  `;
}
