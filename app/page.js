"use client"

import { useState } from "react"
import { estimate } from "@/functions/estimate"

export default function Home() {
  const [minutes, setMinutes] = useState("")
  const [seconds, setSeconds] = useState("")
  const [result, setResult] = useState(null)

  const [lthr, setLthr] = useState("")
  const [zones, setZones] = useState([])

  async function findClosestEstimate() {
    // convert to numbers
    const min = parseInt(minutes, 10) || 0
    const sec = parseInt(seconds, 10) || 0

    // Validate minutes and seconds
    if (
      isNaN(min) ||
      isNaN(sec) || // not a number
      min < 0 ||
      min > 60 || // out of range
      sec < 0 ||
      sec > 60
    ) {
      alert("Please enter valid minutes and seconds between 0 and 60.")
      return // stop execution
    }

    const data = await estimate(min, sec)
    setResult(data)
  }

  const calculateZones = () => {
    const L = parseFloat(lthr)
    if (isNaN(L)) return

    const data = [
      {
        name: "Level 1 - Walking/Jog",
        range: `<${Math.round(L * 0.68)} bpm`,
        detail: "0-2 RPE",
      },
      {
        name: "Level 2 - Easy pace",
        range: `${Math.round(L * 0.69)}–${Math.round(L * 0.83)} bpm`,
        detail: "2-3 RPE",
      },
      {
        name: "Level 3 - Marathon pace",
        range: `${Math.round(L * 0.84)}–${Math.round(L * 0.94)} bpm`,
        detail: "3-4 RPE",
      },
      {
        name: "Level 4 - Threshold pace",
        range: `${Math.round(L * 0.95)}–${Math.round(L * 1.05)} bpm`,
        detail: "4-5 RPE",
      },
      {
        name: "Level 5 - Interval pace",
        range: `${Math.round(L * 1.06)}< bpm`,
        detail: "6-7 RPE",
      },
      {
        name: "Level 6 - Repetition pace",
        range: `${Math.round(L * 1.06)}< bpm`,
        detail: "7-10 RPE",
      },
      {
        name: "Level 7 - Max Effort",
        range: "",
        detail: "",
      },
    ]

    setZones(data)
  }

  return (
    <div className="flex flex-col justify-center gap-2">
      <h1 className="text-4xl font-bold">Input your 5 km result here</h1>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col justify-around">
          <div></div>
          <p className="text-gray-500 italic">Test result</p>
        </div>

        <div className="gap-2">
          <input
            type="text"
            placeholder="minutes"
            className="input"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>

        <div className="gap-2">
          <input
            type="text"
            placeholder="seconds"
            className="input"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
          />
        </div>
      </div>

      <button onClick={findClosestEstimate} className="btn">
        Fetch Estimates
      </button>

      <div className="min-h-70">
        {result &&
          Object.entries(result).map(([key, value]) => (
            <div key={key} className="flex">
              <p className="font-bold">{key}: </p>
              &nbsp;
              <p className="italic text-amber-600">{value}</p>
            </div>
          ))}
      </div>

      {/* LACTATE HEART RATE ZONES */}
      <h1 className="text-4xl font-bold">Input your heart rate here</h1>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col justify-around">
          <div></div>
          <p className="text-gray-500 italic">Heart Rate Result</p>
        </div>

        <div className="gap-2">
          <input
            type="number"
            placeholder="Heart Rate"
            value={lthr}
            className="input"
            onChange={(e) => setLthr(e.target.value)}
          />
        </div>
      </div>

      <button onClick={calculateZones} className="btn">
        Fetch Estimates
      </button>

      <h3 className="text-xl font-bold italic flex items-end">
        <span className="underline">Your</span> &nbsp; Lactate Threshold Heart
        Rate Zones are
      </h3>
      <div className="min-h-115">
        {zones.length > 0 && (
          <div>
            {zones.map((zone, idx) => (
              <div key={idx} className="flex items-end">
                <strong className="p-0 m-0">{zone.name}</strong>
                &nbsp;
                <div className="italic text-amber-600 p-0 m-0">
                  {zone.range}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
