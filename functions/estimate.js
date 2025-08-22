import { supabase } from "../lib/supabaseClient"

// convert minutes + seconds → total seconds
function toSeconds(minutes, seconds) {
  return minutes * 60 + seconds
}

export async function estimate(minutes, seconds) {
  const inputSec = toSeconds(minutes, seconds)

  // fetch all rows
  const { data, error } = await supabase.from("vdot_data").select(
    `
    "Estimated 5km",
    "Estimated Half marathon",
    "Easy_long_pace_Mile",
    "Easy_long_pace_km",
    "marathon_pace_Mile",
    "Marathon_pace_km",
    "Threshold_pace_km",
    "Threshold_pace_Mile",
    "Interval_pace_km",
    "Interval_pace_M"
  `
  )

  if (error) {
    console.error("Supabase error:", error)
    return null
  }

  if (!data || data.length === 0) {
    return null
  }

  // find closest row
  let closestRow = data[0]
  let smallestDiff = Math.abs(
    inputSec - toSeconds(...data[0]["Estimated 5km"].split(":").map(Number))
  )

  for (const row of data) {
    const [m, s] = row["Estimated 5km"].split(":").map(Number)
    const rowSec = toSeconds(m, s)
    const diff = Math.abs(inputSec - rowSec)

    if (diff < smallestDiff) {
      smallestDiff = diff
      closestRow = row
    }
  }

  return {
    "Your estimated half marathon time": closestRow["Estimated Half marathon"],
    "Easy pace (per mile)": closestRow["Easy_long_pace_Mile"],
    "Easy pace (per km)": closestRow["Easy_long_pace_km"],
    "Marathon pace (per mile)": closestRow["marathon_pace_Mile"],
    "Marathon pace (per km)": closestRow["Marathon_pace_km"],
    "Threshold pace (per km)": closestRow["Threshold_pace_km"],
    "Threshold pace (per mile)": closestRow["Threshold_pace_Mile"],
    "Interval pace (per km)": closestRow["Interval_pace_km"],
    "Interval pace (per mile)": closestRow["Interval_pace_M"],
  }
}
