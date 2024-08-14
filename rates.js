async function main(args) {
  const BASE_URL =
    "https://apac.littlehotelier.com/api/v1/properties/kakapolodgedirect/rates.json";
  const startDate = args["start_date"] || "";
  const endDate = args["end_date"] || "";

  const url = `${BASE_URL}?start_date=${startDate}&end_date=${endDate}`;
  const response = await fetch(url);
  return { body: await response.json() };
}
